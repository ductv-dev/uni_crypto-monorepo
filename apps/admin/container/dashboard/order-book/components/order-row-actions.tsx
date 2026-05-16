"use client"

import { BadgeStatus } from "@/components/custom/badge/badge-status"
import { useDeleteOrderBook } from "@/hooks/transactions/order-book/use-delete-order-book"
import { useUpdateOrderBook } from "@/hooks/transactions/order-book/use-update-order-book"
import { formatAmount } from "@/lib/utils/fees"
import {
  EOrderSide,
  EOrderStatus,
  EOrderType,
  TOrderBook,
} from "@/types/transactions/order-book.type"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/index"
import {
  ArrowUpDown,
  Clock3,
  Edit3,
  Eye,
  Hash,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Trash2Icon,
  User,
} from "lucide-react"
import { useState } from "react"

type TOrderRowActionsProps = {
  order: TOrderBook
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

const InfoItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
}) => (
  <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 font-medium break-all">{value}</p>
    </div>
  </div>
)

export const OrderRowActions: React.FC<TOrderRowActionsProps> = ({ order }) => {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [draft, setDraft] = useState<TOrderBook>(order)
  const { mutateAsync: updateOrderBook, isPending } = useUpdateOrderBook()
  const { mutateAsync: deleteOrderBook, isPending: isDeleting } =
    useDeleteOrderBook()
  const orderLabel = order.side === EOrderSide.BUY ? "Buy Order" : "Sell Order"
  const orderTotal = order.price * order.quantity

  const handleSave = async () => {
    try {
      await updateOrderBook(draft)
      setIsEditOpen(false)
      toast.success(`Order #${order.id} updated`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteOrderBook(order.id)
      setIsDeleteOpen(false)
      toast.success(`Order #${order.id} deleted`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed")
    }
  }

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setIsViewOpen(true)
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setDraft(order)
              setIsEditOpen(true)
            }}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setIsDeleteOpen(true)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{orderLabel} Details</DialogTitle>
            <DialogDescription>
              Review full information for order #{order.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Order Side
                </p>
                <p
                  className={
                    order.side === EOrderSide.BUY
                      ? "text-lg font-bold text-emerald-600"
                      : "text-lg font-bold text-rose-600"
                  }
                >
                  {order.side.toUpperCase()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Order Type
                </p>
                <p className="text-lg font-semibold uppercase">{order.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Status
                </p>
                <BadgeStatus status={order.status} />
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Est. Total
                </p>
                <p className="text-lg font-bold">{formatAmount(orderTotal)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Order ID" value={order.id} icon={Hash} />
              <InfoItem
                label="Market"
                value={order.market?.symbol || order.pair}
                icon={ArrowUpDown}
              />
              <InfoItem
                label="User ID"
                value={order.user?.id || order.user_id}
                icon={User}
              />
              <InfoItem
                label="User Email"
                value={order.user?.email || "N/A"}
                icon={Mail}
              />
              <InfoItem label="Market ID" value={order.market_id} icon={Hash} />
              <InfoItem
                label="Price"
                value={formatAmount(order.price)}
                icon={ArrowUpDown}
              />
              <InfoItem
                label="Quantity"
                value={formatAmount(order.quantity)}
                icon={ArrowUpDown}
              />
              <InfoItem
                label="Filled Quantity"
                value={formatAmount(order.filled_qty)}
                icon={ArrowUpDown}
              />
              <InfoItem
                label="Remaining Quantity"
                value={formatAmount(order.remaining_qty)}
                icon={RefreshCw}
              />
              <InfoItem
                label="Created At"
                value={formatDateTime(order.createdAt)}
                icon={Clock3}
              />
              <InfoItem
                label="Updated At"
                value={formatDateTime(order.updatedAt)}
                icon={Clock3}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Quantity
                </p>
                <p className="mt-2 text-xl font-bold">
                  {formatAmount(order.quantity)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Filled
                </p>
                <p className="mt-2 text-xl font-bold">
                  {formatAmount(order.filled_qty)}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Remaining
                </p>
                <p className="mt-2 text-xl font-bold">
                  {formatAmount(order.remaining_qty)}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order #{order.id}</DialogTitle>
            <DialogDescription>
              Update order details for this order book entry.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Pair</label>
              <Input
                value={draft.pair}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, pair: event.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={draft.type}
                  onValueChange={(value) =>
                    setDraft((prev) => ({ ...prev, type: value as EOrderType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EOrderType.LIMIT}>Limit</SelectItem>
                    <SelectItem value={EOrderType.MARKET}>Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Side</label>
                <Select
                  value={draft.side}
                  onValueChange={(value) =>
                    setDraft((prev) => ({ ...prev, side: value as EOrderSide }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EOrderSide.BUY}>Buy</SelectItem>
                    <SelectItem value={EOrderSide.SELL}>Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={draft.amount}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      amount: Number(event.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={draft.price}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      price: Number(event.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={draft.status}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: value as EOrderStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EOrderStatus.OPEN}>Open</SelectItem>
                  <SelectItem value={EOrderStatus.FILLED}>Filled</SelectItem>
                  <SelectItem value={EOrderStatus.CANCELLED}>
                    Cancelled
                  </SelectItem>
                  <SelectItem value={EOrderStatus.PARTIAL_FILLED}>
                    Partial filled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order #{order.id}?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
