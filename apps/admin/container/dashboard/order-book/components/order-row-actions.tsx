"use client"

import { useDeleteOrderBook } from "@/hooks/transactions/orders-book/use-delete-order-book"
import { useUpdateOrderBook } from "@/hooks/transactions/orders-book/use-update-order-book"
import {
  EOrderSide,
  EOrderStatus,
  EOrderType,
  TOrderBook,
} from "@/types/transactions/orders-book.type"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/index"
import { Edit3, MoreHorizontal, Trash2, Trash2Icon } from "lucide-react"
import { useState } from "react"

type TOrderRowActionsProps = {
  order: TOrderBook
}

export const OrderRowActions: React.FC<TOrderRowActionsProps> = ({ order }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [draft, setDraft] = useState<TOrderBook>(order)
  const { mutateAsync: updateOrderBook, isPending } = useUpdateOrderBook()
  const { mutateAsync: deleteOrderBook, isPending: isDeleting } =
    useDeleteOrderBook()

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
                    <SelectItem value={EOrderType.BUY}>Buy</SelectItem>
                    <SelectItem value={EOrderType.SELL}>Sell</SelectItem>
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
                    <SelectItem value={EOrderSide.LIMIT}>Limit</SelectItem>
                    <SelectItem value={EOrderSide.MARKET}>Market</SelectItem>
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
                  <SelectItem value={EOrderStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={EOrderStatus.FILLED}>Filled</SelectItem>
                  <SelectItem value={EOrderStatus.CANCELED}>
                    Canceled
                  </SelectItem>
                  <SelectItem value={EOrderStatus.PARTIALLY_FILLED}>
                    Partially filled
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
