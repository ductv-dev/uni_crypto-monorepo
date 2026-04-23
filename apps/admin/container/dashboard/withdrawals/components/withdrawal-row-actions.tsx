"use client"

import { useDeleteWithdrawal } from "@/hooks/transactions/withdrawals/use-delete-withdrawal"
import { useUpdateWithdrawal } from "@/hooks/transactions/withdrawals/use-update-withdrawal"
import {
  EWithdrawStatus,
  Withdrawals,
} from "@/types/transactions/withdraw.type"
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

type TWithdrawalRowActionsProps = {
  withdrawal: Withdrawals
}

export const WithdrawalRowActions: React.FC<TWithdrawalRowActionsProps> = ({
  withdrawal,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [draft, setDraft] = useState<Withdrawals>(withdrawal)
  const { mutateAsync: updateWithdrawal, isPending } = useUpdateWithdrawal()
  const { mutateAsync: deleteWithdrawal, isPending: isDeleting } =
    useDeleteWithdrawal()

  const handleSave = async () => {
    try {
      await updateWithdrawal(draft)
      setIsEditOpen(false)
      toast.success(`Withdrawal #${withdrawal.id} updated`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteWithdrawal(withdrawal.id)
      setIsDeleteOpen(false)
      toast.success(`Withdrawal #${withdrawal.id} deleted`)
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
              setDraft(withdrawal)
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
            <DialogTitle>Edit Withdrawal #{withdrawal.id}</DialogTitle>
            <DialogDescription>
              Update withdrawal details for this request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Asset</label>
              <Input
                value={draft.asset}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, asset: event.target.value }))
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
              <label className="text-sm font-medium">Fee</label>
              <Input
                type="number"
                step="0.0001"
                value={draft.fee}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    fee: Number(event.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Network</label>
              <Input
                value={draft.network}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    network: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Approved by</label>
              <Input
                value={draft.approved_by}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    approved_by: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={draft.status}
                onValueChange={(value) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: value as EWithdrawStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EWithdrawStatus.PENDING}>
                    Pending
                  </SelectItem>
                  <SelectItem value={EWithdrawStatus.APPROVED}>
                    Approved
                  </SelectItem>
                  <SelectItem value={EWithdrawStatus.REJECTED}>
                    Rejected
                  </SelectItem>
                  <SelectItem value={EWithdrawStatus.COMPLETED}>
                    Completed
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
            <AlertDialogTitle>Delete withdrawal?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete withdrawal #{withdrawal.id}?
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
