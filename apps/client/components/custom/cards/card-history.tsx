import { cn } from "@/lib/utils/utils"
import { Badge } from "@workspace/ui/components/badge"
import { ArrowDown, ArrowDownUp, ArrowUp, Download, Upload } from "lucide-react"
import { TTransaction } from "@workspace/shared/types"

type TCardHistory = {
  transaction: TTransaction
  className?: string
}

const getTypeConfig = (type: TTransaction["type"]) => {
  const configs = {
    buy: {
      icon: ArrowDown,
      label: "Mua",
      color: "text-blue-500",
    },
    sell: {
      icon: ArrowUp,
      label: "Bán",
      color: "text-red-500",
    },
    swap: {
      icon: ArrowDownUp,
      label: "Hoán đổi",
      color: "text-purple-500",
    },
    send: {
      icon: Upload,
      label: "Gửi",
      color: "text-orange-500",
    },
    receive: {
      icon: Download,
      label: "Nhận",
      color: "text-green-500",
    },
  }
  return configs[type]
}

const getStatusConfig = (status: TTransaction["status"]) => {
  const configs = {
    success: {
      label: "Thành công",
      variant: "default" as const,
    },
    pending: {
      label: "Đang xử lý",
      variant: "secondary" as const,
    },
    failed: {
      label: "Thất bại",
      variant: "destructive" as const,
    },
  }
  return configs[status]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export const CardHistory: React.FC<TCardHistory> = ({
  transaction,
  className,
}) => {
  const typeConfig = getTypeConfig(transaction.type)
  const statusConfig = getStatusConfig(transaction.status)
  const TypeIcon = typeConfig.icon

  const displayText = transaction.toSymbol
    ? `${transaction.fromSymbol} → ${transaction.toSymbol}`
    : transaction.fromSymbol

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/50",
        className
      )}
    >
      {/* Icon & Info */}
      <div className="flex flex-1 items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-background",
            typeConfig.color
          )}
        >
          <TypeIcon size={20} />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {typeConfig.label}
            </p>
            <Badge variant={statusConfig.variant} className="text-xs">
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-xs text-foreground/60">{displayText}</p>
        </div>
      </div>

      {/* Amount & Date */}
      <div className="flex flex-col items-end gap-1">
        <p className="text-sm font-semibold text-foreground">
          ${transaction.usdtValue.toFixed(2)}
        </p>
        <p className="text-xs text-foreground/60">
          {formatDate(transaction.createdAt)}
        </p>
      </div>
    </div>
  )
}
