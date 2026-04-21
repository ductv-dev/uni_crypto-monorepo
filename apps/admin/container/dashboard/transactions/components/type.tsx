import { ETransactionType } from "@/types/transaction.type"
import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowRightLeft,
  Upload,
} from "lucide-react"

type Props = {
  type: ETransactionType
}
export const TypeTransaction: React.FC<Props> = ({ type }) => {
  const getStatusConfig = (type: ETransactionType) => {
    switch (type) {
      case ETransactionType.DEPOSIT:
        return {
          icon: ArrowDownToLine,
          label: "Deposit",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50",
        }
      case ETransactionType.WITHDRAW:
        return {
          icon: ArrowRightLeft,
          label: "Withdraw",
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/50",
        }
      case ETransactionType.BUY:
        return {
          icon: ArrowDownLeft,
          label: "Buy",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50",
        }
      case ETransactionType.SELL:
        return {
          icon: Upload,
          label: "Sell",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50",
        }
      case ETransactionType.TRANSFER:
        return {
          icon: ArrowLeftRight,
          label: "Transfer",
          className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
        }
      default:
        return {
          label: type,
          className: "bg-gray-100 text-gray-800",
        }
    }
  }

  const config = getStatusConfig(type)
  return (
    <div className={`flex items-center gap-2`}>
      <div
        className={`${config.className} flex items-center justify-center rounded-md p-1`}
      >
        {config.icon && <config.icon className="size-4" />}
      </div>
      {config.label}
    </div>
  )
}
