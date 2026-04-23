"use client"

import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { MOCK_TRADES } from "@/data/transactions/mock-data-trade"
import { useTradeOverview } from "@/hooks/transactions/trades/use-trade-overview"
import { useTrades } from "@/hooks/transactions/trades/use-trades"
import { TTradeFilter, Trade } from "@/types/transactions/trades.type"
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
import { TradeRowActions } from "./components/trade-row-actions"
import { TradesOverview } from "./components/trades-overview"
import { TradesPagination } from "./components/trades-pagination"
import { TradesTable } from "./components/trades-table"
import { TradesToolbar } from "./components/trades-toolbar"
import { DEFAULT_TRADE_FILTER, TTradePagination } from "./types"

export const TradesPage = () => {
  const [pagination, setPagination] = useState<TTradePagination>({
    limit: 10,
    offset: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("")
  const [filter, setFilter] = useState<TTradeFilter>(DEFAULT_TRADE_FILTER)

  const { data: overview, isLoading: isLoadingOverview } = useTradeOverview()
  const { data: trades, isLoading } = useTrades(
    pagination.limit,
    pagination.offset,
    searchQuery,
    filter
  )
  const totalPages = trades?.pagination.totalPages || 0

  const columns = useMemo<ColumnDef<Trade>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Trade ID",
      },
      {
        accessorKey: "buy_order_id",
        header: "Buy Order",
      },
      {
        accessorKey: "sell_order_id",
        header: "Sell Order",
      },
      {
        accessorKey: "pair",
        header: "Pair",
      },
      {
        accessorKey: "price",
        header: "Price",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "total",
        header: "Total",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
          const trade = row.original
          return (
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(new Date(trade.created_at), "MMM dd, yyyy hh:mm a")}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ row }) => {
          const trade = row.original
          return (
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(new Date(trade.updated_at), "MMM dd, yyyy hh:mm a")}
              </span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <TradeRowActions trade={row.original} />,
      },
    ],
    []
  )

  const pairOptions = useMemo(() => {
    const allPairs = new Set(MOCK_TRADES.map((trade) => trade.pair))
    return Array.from(allPairs)
  }, [])

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

  const handleFilterChange = (newFilter: TTradeFilter) => {
    setFilter(newFilter)
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  const table = useReactTable<Trade>({
    data: trades?.data || [],
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
                <BreadcrumbPage>Trade History</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Trade History</h1>
        </div>

        <TradesOverview overview={overview} isLoading={isLoadingOverview} />

        <TradesToolbar
          searchValue={searchQueryDebounced}
          onSearchChange={handleSearchChange}
          filter={filter}
          onFilterApply={handleFilterChange}
          pairOptions={pairOptions}
        />

        <TradesTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          loadingRowCount={pagination.limit}
        />

        <TradesPagination
          pagination={pagination}
          totalPages={totalPages}
          onChange={setPagination}
        />
      </div>
    </SidebarInset>
  )
}
