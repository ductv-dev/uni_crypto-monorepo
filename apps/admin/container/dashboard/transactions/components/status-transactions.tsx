import { ETransactionStatus } from "@/types/transaction.type"
import { Badge } from "@workspace/ui/components/badge"
import { Dot } from "lucide-react"

type TStatus = {
  status: ETransactionStatus
}

export const Status = ({ status }: TStatus) => {
  const getStatusConfig = (status: ETransactionStatus) => {
    switch (status) {
      case ETransactionStatus.SUCCESS:
        return {
          label: "Success",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50",
          dotClassName: "text-green-600 dark:text-green-400",
        }
      case ETransactionStatus.PENDING:
        return {
          label: "Pending",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50",
          dotClassName: "text-yellow-600 dark:text-yellow-400",
        }
      case ETransactionStatus.PROCESSING:
        return {
          label: "Processing",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
          dotClassName: "text-blue-600 dark:text-blue-400",
        }
      case ETransactionStatus.FAILED:
        return {
          label: "Failed",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50",
          dotClassName: "text-red-600 dark:text-red-400",
        }
      case ETransactionStatus.REJECTED:
        return {
          label: "Rejected",
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/50",
          dotClassName: "text-gray-600 dark:text-gray-400",
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
      <Dot className={config.dotClassName} />
      {config.label}
    </Badge>
  )
}
