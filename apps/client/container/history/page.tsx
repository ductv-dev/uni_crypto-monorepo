"use client"
import { CardHistory } from "@/components/custom/cards/card-history"
import { useTransactions } from "@/hooks"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { AlertCircle, BookAlert } from "lucide-react"

export const History = () => {
  const { data: transactions, isLoading, isError } = useTransactions()

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-2.5 p-2.5">
        <h1 className="text-xl font-semibold">Hoạt động</h1>
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col gap-2.5 p-2.5">
        <h1 className="text-xl font-semibold">Hoạt động</h1>
        <div className="flex w-full flex-col items-center justify-center gap-2 py-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-t border-red-500/30 bg-background text-red-500 shadow-lg shadow-border">
            <AlertCircle strokeWidth={2} size={24} />
          </div>
          <p className="text-sm font-medium text-red-500">
            Lỗi khi tải dữ liệu
          </p>
          <p className="text-xs text-foreground/50">Vui lòng thử lại sau</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col gap-2.5 p-2.5">
      <h1 className="text-xl font-semibold">Hoạt động</h1>
      {transactions?.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-2.5 py-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-t border-border bg-background text-primary shadow-lg shadow-border">
            <BookAlert strokeWidth={3} size={24} />
          </div>
          <p className="text-sm text-foreground/60">Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {transactions?.map((transaction) => (
            <CardHistory key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  )
}
