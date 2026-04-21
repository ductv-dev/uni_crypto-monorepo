"use client"

import { useDeleteTransaction } from "@/hooks/transactions/use-delete-transaction"
import { TTransaction } from "@/types/transaction.type"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu"
import { Trash2, Trash2Icon } from "lucide-react"
import { useState } from "react"

type TTransactionDetailViewProps = {
  transaction: TTransaction
}

export const DeleteConfirm: React.FC<TTransactionDetailViewProps> = ({
  transaction,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutateAsync: deleteTransaction, isPending: isLoading } =
    useDeleteTransaction()
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="flex cursor-pointer items-center text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete transaction ({transaction.type}) (
            {transaction.id}) ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex justify-end gap-2">
            <AlertDialogTrigger asChild>
              <Button disabled={isLoading} variant="outline">
                Cancel
              </Button>
            </AlertDialogTrigger>
            <Button
              onClick={async () => {
                await deleteTransaction(transaction.id)
                setIsOpen(false)
              }}
              disabled={isLoading}
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
