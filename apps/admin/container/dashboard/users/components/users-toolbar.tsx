"use client"

import { Input } from "@workspace/ui/components/input"
import { Search } from "lucide-react"
import { FilterUsers } from "./filter-users"
import { FormCreateUser } from "./form-create-user"
import { TUserFilter } from "../types"

type TUsersToolbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  filter: TUserFilter
  onFilterApply: (filter: TUserFilter) => void
}

export const UsersToolbar: React.FC<TUsersToolbarProps> = ({
  searchValue,
  onSearchChange,
  filter,
  onFilterApply,
}) => {
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <div className="flex items-center gap-2">
          <FilterUsers filter={filter} onApply={onFilterApply} />
          <FormCreateUser onSuccess={() => {}} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm min-w-[240px] flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by Email, ID Number..."
            className="pl-8"
          />
        </div>
      </div>
    </>
  )
}
