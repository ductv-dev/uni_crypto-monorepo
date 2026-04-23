"use client"
import { CardTransactions } from "@/components/custom/card/card-transactions"
import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { TFilters, useTransaction } from "@/hooks/transactions/use-transactions"
import { useTransactionsOverview } from "@/hooks/transactions/use-transactions-overview"
import { TTransaction } from "@/types/transaction.type"
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
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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
import { format } from "date-fns"
import { debounce } from "lodash"
import { ClockIcon, MoreHorizontal } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { DeleteConfirm } from "./components/delete-transactions"
import { TransactionDetailView } from "./components/detail-view-transaxtion"
import { RiskLevel } from "./components/risk-level-transactions"
import { Status } from "./components/status-transactions"
import { TransactionsToolbar } from "./components/transactions-toolbar"
import { TypeTransaction } from "./components/type"

export const Transaction = () => {
  const [limit, setLimit] = useState<number>(10)
  const [offset, setOffset] = useState<number>(0)
  const [filter, setFilter] = useState<TFilters>({
    type: undefined,
    status: undefined,
    riskLevel: undefined,
    startDate: "",
    endDate: "",
    shortBy: "createdAt",
    shortDirection: "desc",
    tokenSymbol: "",
    network: "",
  })
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("")

  const [search, setSearch] = useState("")
  const { data: transactionOverView, isLoading: isLoadingOverview } =
    useTransactionsOverview()
  const { data: transactionData, isLoading } = useTransaction(
    search,
    filter,
    limit,
    offset
  )
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value)
      }, 500),
    []
  )
  const handleSearchChange = (value: string) => {
    setSearchQueryDebounced(value)
    debouncedSearch(value)
  }
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])
  const columns: ColumnDef<TTransaction>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },

    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "tokenSymbol",
      header: "Token Symbol",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <TypeTransaction type={row.original.type} />,
    },
    {
      accessorKey: "network",
      header: "Network",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Status status={row.original.status} />,
    },

    {
      accessorKey: "riskLevel",
      header: "Risk Level",
      cell: ({ row }) => <RiskLevel riskLevel={row.original.riskLevel} />,
    },
    {
      accessorKey: "createdAt",
      header: "Time",
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {format(new Date(transaction.createdAt), "MMM dd, yyyy hh:mm a")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <TransactionDetailView transaction={row.original} />
              <DeleteConfirm transaction={row.original} />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: transactionData?.data || [],
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
              <BreadcrumbItem>
                <BreadcrumbLink href="/transactions">
                  Transactions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All transactions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            All transactions
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoadingOverview
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full" />
              ))
            : transactionOverView?.map((item) => (
                <CardTransactions key={item.title} data={item} />
              ))}
        </div>
        <TransactionsToolbar
          searchValue={searchQueryDebounced}
          onSearchChange={handleSearchChange}
          filter={filter}
          onFilterChange={setFilter}
        />
        <div className="overflow-hidden rounded-md border">
          <div className="w-full">
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
                  Array.from({ length: 10 }).map((_, index) => (
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
                      Không tìm thấy giao dịch nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault()
                    setOffset(Math.max(0, offset - limit))
                  }}
                />
              </PaginationItem>
              {Array.from({
                length: transactionData?.meta.totalPages || 0,
              }).map((_, index) => {
                const isActive = offset / limit === index
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={isActive}
                      onClick={(e) => {
                        e.preventDefault()
                        setOffset(index * limit)
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
                    setOffset(
                      Math.min(
                        Math.max(
                          (transactionData?.meta.totalPages || 0) - 1,
                          0
                        ) * limit,
                        offset + limit
                      )
                    )
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </SidebarInset>
  )
}
