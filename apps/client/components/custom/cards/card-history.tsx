import { cn } from "@/lib/utils/utils"
import { type BackendHistoryItem } from "@/lib/api/history"
import { Badge } from "@workspace/ui/components/badge"
import { ArrowDown, ArrowDownUp, ArrowUp, Download, Upload } from "lucide-react"

type TCardHistory = {
  transaction: BackendHistoryItem
  className?: string
}

const getTypeConfig = (type: BackendHistoryItem["type"]) => {
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
    deposit: {
      icon: Download,
      label: "Nạp",
      color: "text-green-500",
    },
    withdraw: {
      icon: Upload,
      label: "Rút",
      color: "text-orange-500",
    },
    order_lock: {
      icon: ArrowDownUp,
      label: "Khóa lệnh",
      color: "text-violet-500",
    },
    order_unlock: {
      icon: ArrowDownUp,
      label: "Mở khóa lệnh",
      color: "text-indigo-500",
    },
    trade_buy: {
      icon: ArrowDown,
      label: "Khớp mua",
      color: "text-blue-500",
    },
    trade_sell: {
      icon: ArrowUp,
      label: "Khớp bán",
      color: "text-red-500",
    },
    fee: {
      icon: ArrowUp,
      label: "Phí",
      color: "text-rose-500",
    },
  }

  return configs[type as keyof typeof configs] || configs.order_lock
}

const getStatusConfig = (status: BackendHistoryItem["status"]) => {
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
    completed: {
      label: "Hoàn tất",
      variant: "default" as const,
    },
    rejected: {
      label: "Từ chối",
      variant: "destructive" as const,
    },
  }

  return configs[status as keyof typeof configs] || configs.pending
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

  const assetSymbol = transaction.wallet?.asset?.symbol || "--"
  const amount = Number(transaction.amount) || 0
  const directionSign = transaction.direction === "debit" ? "-" : "+"

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
          <p className="text-xs text-foreground/60">
            {assetSymbol} • {transaction.reference_type || "wallet"}
          </p>
        </div>
      </div>

      {/* Amount & Date */}
      <div className="flex flex-col items-end gap-1">
        <p className="text-sm font-semibold text-foreground">
          {directionSign}
          {amount.toLocaleString("en-US", {
            maximumFractionDigits: 8,
          })}{" "}
          {assetSymbol}
        </p>
        <p className="text-xs text-foreground/60">
          {formatDate(transaction.createdAt)}
        </p>
      </div>
    </div>
  )
}
