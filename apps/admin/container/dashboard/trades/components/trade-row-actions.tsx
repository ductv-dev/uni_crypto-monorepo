"use client"

import { useDeleteTrade } from "@/hooks/transactions/trades/use-delete-trade"
import { useUpdateTrade } from "@/hooks/transactions/trades/use-update-trade"
import { Trade } from "@/types/transactions/trades.type"
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
import { toast } from "@workspace/ui/index"
import { Edit3, MoreHorizontal, Trash2, Trash2Icon } from "lucide-react"
import { useState } from "react"

type TTradeRowActionsProps = {
  trade: Trade
}

export const TradeRowActions: React.FC<TTradeRowActionsProps> = ({ trade }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [draft, setDraft] = useState<Trade>(trade)
  const { mutateAsync: updateTrade, isPending } = useUpdateTrade()
  const { mutateAsync: deleteTrade, isPending: isDeleting } = useDeleteTrade()

  const handleSave = async () => {
    try {
      await updateTrade(draft)
      setIsEditOpen(false)
      toast.success(`Trade ${trade.id} updated`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTrade(trade.id)
      setIsDeleteOpen(false)
      toast.success(`Trade ${trade.id} deleted`)
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
              setDraft(trade)
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
            <DialogTitle>Edit Trade {trade.id}</DialogTitle>
            <DialogDescription>
              Update trade details for this execution record.
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
              <label className="text-sm font-medium">Total</label>
              <Input
                type="number"
                step="0.0001"
                value={draft.total}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    total: Number(event.target.value) || 0,
                  }))
                }
              />
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
            <AlertDialogTitle>Delete trade?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete trade {trade.id}?
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
