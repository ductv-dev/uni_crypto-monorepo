"use client"

import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useUserOverview } from "@/hooks/users/use-user-overview"
import { useUser } from "@/hooks/users/use-users"
import { TUser } from "@/types/user.type"
import {
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import { debounce } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { getUserColumns } from "./components/users-columns"
import { UsersOverview } from "./components/users-overview"
import { UsersPagination } from "./components/users-pagination"
import { UsersTable } from "./components/users-table"
import { UsersToolbar } from "./components/users-toolbar"
import { DEFAULT_USER_FILTER, TUserFilter, TUserPagination } from "./types"

export const User = () => {
  const [pagination, setPagination] = useState<TUserPagination>({
    limit: 10,
    offset: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("")
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [filter, setFilter] = useState<TUserFilter>(DEFAULT_USER_FILTER)

  const { data: overview, isLoading: isLoadingOverview } = useUserOverview()
  const { data: dataUser, isLoading } = useUser(
    pagination.limit,
    pagination.offset,
    searchQuery,
    filter
  )

  const totalPages = dataUser?.pagination.totalPages || 0

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value)
        setPagination((prev) => ({ ...prev, offset: 0 }))
      }, 500),
    []
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const columns = useMemo(() => getUserColumns(), [])

  const table = useReactTable<TUser>({
    data: dataUser?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  const handleSearchChange = (value: string) => {
    setSearchQueryDebounced(value)
    debouncedSearch(value)
  }

  const handleFilterChange = (newFilter: TUserFilter) => {
    setFilter(newFilter)
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>User Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <UsersToolbar
          searchValue={searchQueryDebounced}
          onSearchChange={handleSearchChange}
          filter={filter}
          onFilterApply={handleFilterChange}
        />

        <UsersOverview overview={overview} isLoading={isLoadingOverview} />

        <UsersTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          loadingRowCount={pagination.limit}
        />

        <UsersPagination
          pagination={pagination}
          totalPages={totalPages}
          onChange={setPagination}
        />
      </div>
    </SidebarInset>
  )
}
