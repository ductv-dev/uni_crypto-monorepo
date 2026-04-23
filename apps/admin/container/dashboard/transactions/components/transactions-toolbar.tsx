"use client"

import { TFilters } from "@/hooks/transactions/use-transactions"
import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"
import { FilterTransactions } from "./filter-transactions"

type TTransactionsToolbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filter: TFilters
  onFilterChange: (filter: TFilters) => void
}

export const TransactionsToolbar: React.FC<TTransactionsToolbarProps> = ({
  searchValue,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => {
            onSearchChange(event.target.value)
          }}
          placeholder="Search by Hash, User ID..."
          className="pl-8"
        />
      </div>
      <FilterTransactions filter={filter} setFilter={onFilterChange} />
    </div>
  )
}
