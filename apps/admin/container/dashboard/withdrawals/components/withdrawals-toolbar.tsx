"use client"

import { TWithdrawFilter } from "@/types/transactions/withdrawal.type"
import { Input } from "@workspace/ui/components/input"
import { SearchIcon } from "lucide-react"
import { FilterWithdrawals } from "./filter-withdrawals"

type TWithdrawalsToolbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filter: TWithdrawFilter
  onFilterApply: (newFilter: TWithdrawFilter) => void
}

export const WithdrawalsToolbar: React.FC<TWithdrawalsToolbarProps> = ({
  searchValue,
  onSearchChange,
  filter,
  onFilterApply,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-[300px] flex-1 items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by User ID, Asset, Network, Tx Hash..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <FilterWithdrawals filter={filter} onApply={onFilterApply} />
    </div>
  )
}
