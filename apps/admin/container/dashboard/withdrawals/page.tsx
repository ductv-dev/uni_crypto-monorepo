"use client"

import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useWithdrawalOverview } from "@/hooks/transactions/withdrawals/use-withdrawal-overview"
import { useWithdrawals } from "@/hooks/transactions/withdrawals/use-withdrawals"
import {
  TWithdrawFilter,
  TWithdrawals,
} from "@/types/transactions/withdraw.type"
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
import { WithdrawalRowActions } from "./components/withdrawal-row-actions"
import { WithdrawalsOverview } from "./components/withdrawals-overview"
import { WithdrawalsPagination } from "./components/withdrawals-pagination"
import { WithdrawalsTable } from "./components/withdrawals-table"
import { WithdrawalsToolbar } from "./components/withdrawals-toolbar"
import { DEFAULT_WITHDRAWAL_FILTER, TWithdrawalPagination } from "./types"

export const WithdrawalsPage = () => {
  const [pagination, setPagination] = useState<TWithdrawalPagination>({
    limit: 10,
    offset: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("")
  const [filter, setFilter] = useState<TWithdrawFilter>(
    DEFAULT_WITHDRAWAL_FILTER
  )

  const { data: overview, isLoading: isLoadingOverview } =
    useWithdrawalOverview()
  const { data: withdrawals, isLoading } = useWithdrawals(
    pagination.limit,
    pagination.offset,
    searchQuery,
    filter
  )
  const totalPages = withdrawals?.pagination.totalPages || 0

  const columns = useMemo<ColumnDef<TWithdrawals>[]>(
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
        accessorKey: "fee",
        header: "Fee",
      },
      {
        accessorKey: "network",
        header: "Network",
      },
      {
        accessorKey: "to_address",
        header: "To Address",
        cell: ({ row }) => {
          const address = row.original.to_address
          return (
            <span className="font-mono text-xs">
              {address.slice(0, 8)}...{address.slice(-8)}
            </span>
          )
        },
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
        accessorKey: "approved_by",
        header: "Approved By",
        cell: ({ row }) => row.original.approved_by || "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                status === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : status === "pending"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : status === "approved"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )
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
        cell: ({ row }) => <WithdrawalRowActions withdrawal={row.original} />,
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

  const handleFilterChange = (newFilter: TWithdrawFilter) => {
    setFilter(newFilter)
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  const table = useReactTable<TWithdrawals>({
    data: withdrawals?.data || [],
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
                <BreadcrumbPage>Withdrawals</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Withdrawals</h1>
        </div>

        <WithdrawalsOverview
          overview={overview}
          isLoading={isLoadingOverview}
        />

        <WithdrawalsToolbar
          searchValue={searchQueryDebounced}
          onSearchChange={handleSearchChange}
          filter={filter}
          onFilterApply={handleFilterChange}
        />

        <WithdrawalsTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          loadingRowCount={pagination.limit}
        />

        <WithdrawalsPagination
          pagination={pagination}
          totalPages={totalPages}
          onChange={setPagination}
        />
      </div>
    </SidebarInset>
  )
}
