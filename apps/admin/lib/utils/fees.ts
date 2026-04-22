import { TFeeRecord } from "@/data/mock-data-fee"

export const formatAmount = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value)
}

export const formatDateTime = (value: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export const getFeeTypeLabel = (feeType: TFeeRecord["feeType"]) => {
  switch (feeType) {
    case "trading":
      return "Trading"
    case "withdrawal":
      return "Withdrawal"
    case "deposit":
      return "Deposit"
    default:
      return feeType
  }
}

export const getFeeTypeClassName = (feeType: TFeeRecord["feeType"]) => {
  switch (feeType) {
    case "trading":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    case "withdrawal":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    case "deposit":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}
