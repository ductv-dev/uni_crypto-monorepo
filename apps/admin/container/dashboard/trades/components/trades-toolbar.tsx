"use client"

import { TTradeFilter } from "@/types/transactions/trades.type"
import { Input } from "@workspace/ui/components/input"
import { SearchIcon } from "lucide-react"
import { FilterTrades } from "./filter-trades"

type TTradesToolbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filter: TTradeFilter
  onFilterApply: (newFilter: TTradeFilter) => void
  pairOptions: string[]
}

export const TradesToolbar: React.FC<TTradesToolbarProps> = ({
  searchValue,
  onSearchChange,
  filter,
  onFilterApply,
  pairOptions,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-[300px] flex-1 items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Trade ID, Pair, Buy/Sell Order ID..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <FilterTrades
        filter={filter}
        onApply={onFilterApply}
        pairOptions={pairOptions}
      />
    </div>
  )
}
