"use client"

import { BadgeStatus } from "@/components/custom/badge/badge-status"
import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useDepositOverview } from "@/hooks/transactions/deposits/use-deposit-overview"
import { useDeposits } from "@/hooks/transactions/deposits/use-deposits"
import { TDepositFilter, TDeposits } from "@/types/transactions/deposits.type"
import {
  ColumnDef,
  getCoreRowModel,
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
import { format } from "date-fns"
import { debounce } from "lodash"
import { ClockIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { DepositRowActions } from "./components/deposit-row-actions"
import { DepositsOverview } from "./components/deposits-overview"
import { DepositsPagination } from "./components/deposits-pagination"
import { DepositsTable } from "./components/deposits-table"
import { DepositsToolbar } from "./components/deposits-toolbar"
import { DEFAULT_DEPOSIT_FILTER, TDepositPagination } from "./types"

export const Deposits = () => {
  const [pagination, setPagination] = useState<TDepositPagination>({
    limit: 10,
    offset: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("")
  const [filter, setFilter] = useState<TDepositFilter>(DEFAULT_DEPOSIT_FILTER)

  const { data: overview, isLoading: isLoadingOverview } = useDepositOverview()
  const { data: deposits, isLoading } = useDeposits(
    pagination.limit,
    pagination.offset,
    searchQuery,
    filter
  )
  const totalPages = deposits?.pagination.totalPages || 0

  const columns = useMemo<ColumnDef<TDeposits>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "user_id",
        header: "User ID",
      },
      {
        accessorKey: "asset",
        header: "Asset",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "network",
        header: "Network",
      },
      {
        accessorKey: "tx_hash",
        header: "Tx Hash",
        cell: ({ row }) => {
          const hash = row.original.tx_hash
          return (
            <span className="font-mono text-xs">
              {hash.slice(0, 10)}...{hash.slice(-10)}
            </span>
          )
        },
      },
      {
        accessorKey: "confirmations",
        header: "Confirmations",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status
          return <BadgeStatus status={status} />
        },
      },
      {
        accessorKey: "created_at",
        header: "Time",
        cell: ({ row }) => {
          const transaction = row.original
          return (
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(
                  new Date(transaction.created_at),
                  "MMM dd, yyyy hh:mm a"
                )}
              </span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <DepositRowActions deposit={row.original} />,
      },
    ],
    []
  )

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

  const handleSearchChange = (value: string) => {
    setSearchQueryDebounced(value)
    debouncedSearch(value)
  }

  const handleFilterChange = (newFilter: TDepositFilter) => {
    setFilter(newFilter)
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  const table = useReactTable<TDeposits>({
    data: deposits?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
                <BreadcrumbLink href="/transactions">
                  Transactions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Deposits</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Deposits</h1>
        </div>

        <DepositsOverview overview={overview} isLoading={isLoadingOverview} />

        <DepositsToolbar
          searchValue={searchQueryDebounced}
          onSearchChange={handleSearchChange}
          filter={filter}
          onFilterApply={handleFilterChange}
        />

        <DepositsTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          loadingRowCount={pagination.limit}
        />

        <DepositsPagination
          pagination={pagination}
          totalPages={totalPages}
          onChange={setPagination}
        />
      </div>
    </SidebarInset>
  )
}
