"use client"

import {
  useDeleteDeposit,
  type TRejectDepositPayload,
} from "@/hooks/transactions/deposits/use-delete-deposit"
import {
  useUpdateDeposit,
  type TApproveDepositPayload,
} from "@/hooks/transactions/deposits/use-update-deposit"
import { EDepositStatus, TDeposits } from "@/types/transactions/deposits.type"
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

type TDepositRowActionsProps = {
  deposit: TDeposits
}

export const DepositRowActions: React.FC<TDepositRowActionsProps> = ({
  deposit,
}) => {
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [approveDraft, setApproveDraft] = useState<TApproveDepositPayload>({
    id: String(deposit.id),
    note: deposit.note ?? "",
  })
  const [rejectDraft, setRejectDraft] = useState<TRejectDepositPayload>({
    id: String(deposit.id),
    rejected_reason: deposit.rejected_reason ?? "",
  })
  const { mutateAsync: approveDeposit, isPending: isApproving } =
    useUpdateDeposit()
  const { mutateAsync: rejectDeposit, isPending: isRejecting } =
    useDeleteDeposit()

  const isPendingDeposit = deposit.status === EDepositStatus.PENDING

  const handleApprove = async () => {
    try {
      await approveDeposit(approveDraft)
      setIsApproveOpen(false)
      toast.success(`Deposit #${deposit.id} approved`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Approve failed")
    }
  }

  const handleReject = async () => {
    try {
      await rejectDeposit(rejectDraft)
      setIsRejectOpen(false)
      toast.success(`Deposit #${deposit.id} rejected`)
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
            disabled={!isPendingDeposit}
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setApproveDraft({
                id: String(deposit.id),
                note: deposit.note ?? "",
              })
              setIsApproveOpen(true)
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
            disabled={!isPendingDeposit}
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setRejectDraft({
                id: String(deposit.id),
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
            <DialogTitle>Approve Deposit #{deposit.id}</DialogTitle>
            <DialogDescription>
              Confirm this deposit request and optionally attach an internal
              note.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">User</label>
              <Input value={deposit.user_email ?? deposit.user_id} disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Asset</label>
              <Input value={deposit.asset} disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount</label>
              <Input value={String(deposit.amount)} disabled />
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
            <AlertDialogTitle>Reject deposit?</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason before rejecting deposit #{deposit.id}.
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
