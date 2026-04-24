"use client"

import { TFilterOrderBook } from "@/types/transactions/order-book.type"
import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"
import { FilterOrderBook } from "./filter-order-book"

type TOrderBookToolbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filter: TFilterOrderBook
  onFilterApply: (newFilter: TFilterOrderBook) => void
}

export const OrderBookToolbar: React.FC<TOrderBookToolbarProps> = ({
  searchValue,
  onSearchChange,
  filter,
  onFilterApply,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 lg:justify-between">
      <div className="relative max-w-sm min-w-[240px] flex-1">
        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by User ID, Pair, Side..."
          className="pl-8"
        />
      </div>

      <FilterOrderBook filter={filter} onApply={onFilterApply} />
    </div>
  )
}
