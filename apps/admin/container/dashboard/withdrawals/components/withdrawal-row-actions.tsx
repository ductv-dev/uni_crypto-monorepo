"use client"

import {
  useDeleteWithdrawal,
  type TRejectWithdrawalPayload,
} from "@/hooks/transactions/withdrawals/use-delete-withdrawal"
import {
  useUpdateWithdrawal,
  type TApproveWithdrawalPayload,
} from "@/hooks/transactions/withdrawals/use-update-withdrawal"
import {
  EWithdrawStatus,
  TWithdrawals,
} from "@/types/transactions/withdrawal.type"
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
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "@workspace/ui/index"
import { CheckCircle2, MoreHorizontal, XCircle } from "lucide-react"
import { useState } from "react"

type TWithdrawalRowActionsProps = {
  withdrawal: TWithdrawals
}

export const WithdrawalRowActions: React.FC<TWithdrawalRowActionsProps> = ({
  withdrawal,
}) => {
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [approveDraft, setApproveDraft] = useState<TApproveWithdrawalPayload>({
    id: String(withdrawal.id),
    tx_hash: withdrawal.tx_hash ?? "",
    note: withdrawal.note ?? "",
  })
  const [rejectDraft, setRejectDraft] = useState<TRejectWithdrawalPayload>({
    id: String(withdrawal.id),
    rejected_reason: withdrawal.rejected_reason ?? "",
  })
  const { mutateAsync: approveWithdrawal, isPending: isApproving } =
    useUpdateWithdrawal()
  const { mutateAsync: rejectWithdrawal, isPending: isRejecting } =
    useDeleteWithdrawal()

  const isPendingWithdrawal = withdrawal.status === EWithdrawStatus.PENDING

  const handleApprove = async () => {
    try {
      await approveWithdrawal(approveDraft)
      setIsApproveOpen(false)
      toast.success(`Withdrawal #${withdrawal.id} approved`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Approve failed")
    }
  }

  const handleReject = async () => {
    try {
      await rejectWithdrawal(rejectDraft)
      setIsRejectOpen(false)
      toast.success(`Withdrawal #${withdrawal.id} rejected`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reject failed")
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
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={!isPendingWithdrawal}
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setApproveDraft({
                id: String(withdrawal.id),
                tx_hash: withdrawal.tx_hash ?? "",
                note: withdrawal.note ?? "",
              })
              setIsApproveOpen(true)
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
            disabled={!isPendingWithdrawal}
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setRejectDraft({
                id: String(withdrawal.id),
                rejected_reason: "",
              })
              setIsRejectOpen(true)
            }}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Withdrawal #{withdrawal.id}</DialogTitle>
            <DialogDescription>
              Confirm this withdrawal request and provide transaction hash when
              available.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">User</label>
              <Input
                value={withdrawal.user_email ?? withdrawal.user_id}
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Asset</label>
              <Input value={withdrawal.asset} disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount</label>
              <Input value={String(withdrawal.amount)} disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tx Hash</label>
              <Input
                value={approveDraft.tx_hash ?? ""}
                onChange={(event) =>
                  setApproveDraft((prev) => ({
                    ...prev,
                    tx_hash: event.target.value,
                  }))
                }
                placeholder="Blockchain transaction hash"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Note</label>
              <Textarea
                value={approveDraft.note ?? ""}
                onChange={(event) =>
                  setApproveDraft((prev) => ({
                    ...prev,
                    note: event.target.value,
                  }))
                }
                placeholder="Optional approval note"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <XCircle />
            </AlertDialogMedia>
            <AlertDialogTitle>Reject withdrawal?</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason before rejecting withdrawal #{withdrawal.id}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <Textarea
              value={rejectDraft.rejected_reason}
              onChange={(event) =>
                setRejectDraft((prev) => ({
                  ...prev,
                  rejected_reason: event.target.value,
                }))
              }
              placeholder="Reason for rejection"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectDraft.rejected_reason.trim()}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
