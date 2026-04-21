"use client"

import { TTransaction } from "@/types/transaction.type"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu"
import { Separator } from "@workspace/ui/components/separator"
import { format } from "date-fns"
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Coins,
  Eye,
  Hash,
  Network,
  Receipt,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react"
import { RiskLevel } from "./risk-level-transactions"
import { Status } from "./status-transactions"

type TTransactionDetailViewProps = {
  transaction: TTransaction
}

const InfoItem = ({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string
  value: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
  className?: string
}) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <Icon className="mt-0.5 h-5 w-5 shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-0.5 font-medium break-all text-foreground">{value}</p>
    </div>
  </div>
)

export const TransactionDetailView: React.FC<TTransactionDetailViewProps> = ({
  transaction,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye className="h-4 w-4" />
          View Details
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted/50 p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Status
              </p>
              <Status status={transaction.status} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Risk Level
              </p>
              <RiskLevel riskLevel={transaction.riskLevel} />
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Amount
              </p>
              <p className="text-xl font-bold text-primary">
                {transaction.amount} {transaction.tokenSymbol}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="border-b pb-1 text-sm font-semibold">
                General Information
              </h3>
              <InfoItem
                label="Transaction ID"
                value={transaction.id}
                icon={Hash}
              />
              <InfoItem
                label="User ID"
                value={transaction.userId}
                icon={User}
              />
              <InfoItem
                label="Type"
                value={transaction.type}
                icon={ArrowRightLeft}
              />
              <InfoItem
                label="Token"
                value={transaction.tokenSymbol}
                icon={Coins}
              />
              <InfoItem
                label="Network"
                value={transaction.network || "N/A"}
                icon={Network}
              />
            </div>

            <div className="space-y-4">
              <h3 className="border-b pb-1 text-sm font-semibold">
                Fees & Timing
              </h3>
              <InfoItem
                label="Fee"
                value={`${transaction.fee} ${transaction.tokenSymbol}`}
                icon={Receipt}
              />
              <InfoItem
                label="Created At"
                value={format(
                  new Date(transaction.createdAt),
                  "MMM dd, yyyy HH:mm:ss"
                )}
                icon={Clock}
              />
              <InfoItem
                label="Updated At"
                value={format(
                  new Date(transaction.updatedAt),
                  "MMM dd, yyyy HH:mm:ss"
                )}
                icon={Clock}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="border-b pb-1 text-sm font-semibold">
              Addresses & Hash
            </h3>
            <InfoItem
              label="Transaction Hash"
              value={transaction.txHash || "N/A"}
              icon={Hash}
              className="max-w-full"
            />
            <div className="flex flex-col gap-4">
              <InfoItem
                label="From Address"
                value={transaction.fromAddress || "N/A"}
                icon={ArrowRightLeft}
              />
              <InfoItem
                label="To Address"
                value={transaction.toAddress || "N/A"}
                icon={ArrowRightLeft}
              />
            </div>
          </div>

          {(transaction.approvedBy ||
            transaction.rejectedBy ||
            transaction.rejectReason) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="border-b pb-1 text-sm font-semibold">
                  Admin Action
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {transaction.approvedBy && (
                    <InfoItem
                      label="Approved By"
                      value={transaction.approvedBy}
                      icon={CheckCircle2}
                    />
                  )}
                  {transaction.rejectedBy && (
                    <InfoItem
                      label="Rejected By"
                      value={transaction.rejectedBy}
                      icon={XCircle}
                    />
                  )}
                </div>
                {transaction.rejectReason && (
                  <InfoItem
                    label="Reject Reason"
                    value={transaction.rejectReason}
                    icon={ShieldAlert}
                    className="text-destructive"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
