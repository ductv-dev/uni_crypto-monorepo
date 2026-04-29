import { EStatus } from "@/types/status.enum"
import { Badge } from "@workspace/ui/components/badge"

type TStatus = {
  status: EStatus | string
}

export const BadgeStatus: React.FC<TStatus> = ({ status }) => {
  const getStatusConfig = (status: EStatus | string) => {
    const normalizedStatus = String(status).toUpperCase()

    switch (normalizedStatus) {
      case EStatus.SUCCESS:
      case EStatus.ACTIVE:
      case EStatus.VERIFIED:
      case EStatus.FILLED:
      case EStatus.PAID:
      case EStatus.CONFIRMED:
      case EStatus.REFUNDED:
      case EStatus.COMPLETED:
        return {
          label:
            {
              [EStatus.SUCCESS]: "Success",
              [EStatus.ACTIVE]: "Active",
              [EStatus.VERIFIED]: "Verified",
              [EStatus.FILLED]: "Filled",
              [EStatus.PAID]: "Paid",
              [EStatus.REFUNDED]: "Refunded",
              [EStatus.CONFIRMED]: "Confirmed",
              [EStatus.COMPLETED]: "Completed",
            }[normalizedStatus] ?? "Success",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50",
          dotClassName: "text-green-600 dark:text-green-400",
        }
      case EStatus.PENDING:
        return {
          label: "Pending",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
          dotClassName: "text-yellow-600 dark:text-yellow-400",
        }
      case EStatus.PROCESSING:
        return {
          label: "Processing",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
          dotClassName: "text-blue-600 dark:text-blue-400",
        }
      case EStatus.FAILED:
      case EStatus.BANNED:
      case EStatus.DISABLED:
      case EStatus.EXPIRED:
      case EStatus.UNPAID:
        return {
          label:
            {
              [EStatus.FAILED]: "Failed",
              [EStatus.BANNED]: "Banned",
              [EStatus.DISABLED]: "Disabled",
              [EStatus.EXPIRED]: "Expired",
              [EStatus.UNPAID]: "Unpaid",
            }[normalizedStatus] ?? "Failed",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50",
          dotClassName: "text-red-600 dark:text-red-400",
        }
      case EStatus.REJECTED:
      case EStatus.UNVERIFIED:
      case EStatus.CANCELLED:
      case EStatus.UNREFUNDED:
      case "CANCELED":
        return {
          label:
            {
              [EStatus.REJECTED]: "Rejected",
              [EStatus.UNVERIFIED]: "Unverified",
              [EStatus.CANCELLED]: "Cancelled",
              [EStatus.UNREFUNDED]: "Unrefunded",
              CANCELED: "Canceled",
            }[normalizedStatus] ?? "Rejected",
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/50",
          dotClassName: "text-gray-600 dark:text-gray-400",
        }
      case "PARTIALLY_FILLED":
      case EStatus.APPPROVED:
        return {
          label:
            {
              [EStatus.APPPROVED]: "Approved",
              PARTIALLY_FILLED: "Partially Filled",
            }[normalizedStatus] ?? "Approved",
          className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
          dotClassName: "text-orange-600 dark:text-orange-400",
        }
      case EStatus.INACTIVE:
        return {
          label: "Inactive",
          className:
            "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800/50",
          dotClassName: "text-slate-600 dark:text-slate-400",
        }
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800",
          dotClassName: "text-gray-600",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
