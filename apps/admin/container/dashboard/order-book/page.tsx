"use client"
import { BadgeStatus } from "@/components/custom/badge/badge-status"
import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useOrderBook } from "@/hooks/transactions/order-book/use-order-book"
import { useOrderBookOverview } from "@/hooks/transactions/order-book/use-order-book-overview"
import { formatAmount } from "@/lib/utils/fees"
import { TPagination } from "@/types/pagination.type"
import {
  TFilterOrderBook,
  TOrderBook,
} from "@/types/transactions/order-book.type"
import {
  ColumnDef,
  flexRender,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { debounce } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { OrderBookToolbar } from "./components/order-book-toolbar"
import { OverviewOrderOverview } from "./components/order-overview"
import { OrderRowActions } from "./components/order-row-actions"

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

const shortId = (value: string) =>
  value.length > 16 ? `${value.slice(0, 8)}...${value.slice(-6)}` : value

export const OrderBook = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("")
  const [pagination, setPagination] = useState<TPagination>({
    limit: 10,
    offset: 0,
  })
  const [filter, setFilter] = useState<TFilterOrderBook>({
    status: undefined,
    type: undefined,
    side: undefined,
  })
  const { data: orders, isLoading } = useOrderBook(
    pagination.limit,
    pagination.offset,
    searchQuery,
    filter
  )
  const { data: orderOverview, isLoading: isLoadingOverview } =
    useOrderBookOverview()

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

  const handleFilterChange = (newFilter: TFilterOrderBook) => {
    setFilter(newFilter)
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  const columns = useMemo<ColumnDef<TOrderBook>[]>(
    () => [
      {
        id: "index",
        header: "STT",
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      },
      {
        accessorKey: "user_id",
        header: "User ID",
        cell: ({ row }) => {
          const userId = row.original.user_id

          return (
            <span className="font-mono text-xs" title={userId}>
              {shortId(userId)}
            </span>
          )
        },
      },
      {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
          const email = row.original.user?.email

          return email ? (
            <div className="max-w-[180px] truncate" title={email}>
              {email}
            </div>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )
        },
      },
      {
        accessorKey: "market_id",
        header: "Market ID",
        cell: ({ row }) => {
          const marketId = row.original.market_id

          return (
            <span className="font-mono text-xs" title={marketId}>
              {shortId(marketId)}
            </span>
          )
        },
      },
      {
        accessorKey: "pair",
        header: "Market",
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.market?.symbol || row.original.pair}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span className="uppercase">{row.original.type}</span>
        ),
      },
      {
        accessorKey: "side",
        header: "Side",
        cell: ({ row }) => (
          <span
            className={
              row.original.side === "buy"
                ? "font-medium text-emerald-600"
                : "font-medium text-rose-600"
            }
          >
            {row.original.side.toUpperCase()}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span>{formatAmount(row.original.price)}</span>,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => <span>{formatAmount(row.original.quantity)}</span>,
      },
      {
        accessorKey: "filled_qty",
        header: "Filled",
        cell: ({ row }) => <span>{formatAmount(row.original.filled_qty)}</span>,
      },
      {
        accessorKey: "remaining_qty",
        header: "Remaining",
        cell: ({ row }) => (
          <span>{formatAmount(row.original.remaining_qty)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          return <BadgeStatus status={row.original.status} />
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <span className="text-sm">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => (
          <span className="text-sm">
            {formatDateTime(row.original.updatedAt)}
          </span>
        ),
      },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <OrderRowActions order={row.original} />,
      },
    ],
    []
  )
  const totalPages = orders?.pagination.totalPages || 0

  const table = useReactTable({
    data: orders?.data || [],
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
                <BreadcrumbLink href="/transactions/order-book">
                  Transactions{" "}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Order Book</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold tracking-tight">Order Book</h1>
        <OverviewOrderOverview
          overview={orderOverview}
          isLoading={isLoadingOverview}
        />

        <OrderBookToolbar
          searchValue={searchQueryDebounced}
          onSearchChange={handleSearchChange}
          filter={filter}
          onFilterApply={handleFilterChange}
        />

        <div className="overflow-hidden rounded-md border">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: pagination.limit }).map((_, index) => (
                    <TableRow key={index}>
                      {columns.map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Không tìm thấy lệnh nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault()
                  setPagination((prev) => ({
                    ...prev,
                    offset: Math.max(0, prev.offset - prev.limit),
                  }))
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => {
              const isActive = pagination.offset / pagination.limit === index
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={isActive}
                    onClick={(e) => {
                      e.preventDefault()
                      setPagination((prev) => ({
                        ...prev,
                        offset: index * prev.limit,
                      }))
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault()
                  setPagination((prev) => ({
                    ...prev,
                    offset: Math.min(
                      Math.max(totalPages - 1, 0) * prev.limit,
                      prev.offset + prev.limit
                    ),
                  }))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </SidebarInset>
  )
}
