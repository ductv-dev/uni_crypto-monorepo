"use client"

import {
  EDepositStatus,
  TDepositFilter,
} from "@/types/transactions/deposits.type"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { SearchIcon } from "lucide-react"

type TDepositsToolbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filter: TDepositFilter
  onFilterApply: (newFilter: TDepositFilter) => void
}

export const DepositsToolbar: React.FC<TDepositsToolbarProps> = ({
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
      <div className="flex items-center gap-2">
        <Select
          value={filter.status || "all"}
          onValueChange={(value) =>
            onFilterApply({
              ...filter,
              status: value === "all" ? undefined : (value as EDepositStatus),
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={EDepositStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={EDepositStatus.CONFIRMED}>Confirmed</SelectItem>
            <SelectItem value={EDepositStatus.FAILED}>Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
