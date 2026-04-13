import { BookAlert } from "lucide-react"
import { CardHistory } from "@/components/custom/cards/card-history"
import { MOCK_TRANSACTIONS } from "@/data/data-mock-history"

export const History = () => {
  return (
    <div className="flex h-full w-full flex-col gap-2.5 p-2.5">
      <h1 className="text-xl font-semibold">Hoạt động</h1>
      {MOCK_TRANSACTIONS.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-2.5 py-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-t border-border bg-background text-primary shadow-lg shadow-border">
            <BookAlert strokeWidth={3} size={24} />
          </div>
          <p>Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {MOCK_TRANSACTIONS.map((transaction) => (
            <CardHistory key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  )
}
