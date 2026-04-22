"use client"

import { FEE_RECORDS, TFeeRecord } from "@/data/mock-data-fee"
import {
  useFeeHistory,
  type TFeeHistoryFilters,
} from "@/hooks/settings/use-fee-history"
import {
  formatAmount,
  formatDateTime,
  getFeeTypeClassName,
  getFeeTypeLabel,
} from "@/lib/utils/fees"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@workspace/ui/components/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export const FeeHistorySection: React.FC = () => {
  const [limit] = useState(8)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")
  const [feeTypeFilter, setFeeTypeFilter] = useState<
    "all" | TFeeRecord["feeType"]
  >("all")
  const [assetFilter, setAssetFilter] = useState("all")

  const assetOptions = useMemo(() => {
    return Array.from(new Set(FEE_RECORDS.map((record) => record.asset))).sort()
  }, [])

  const filters = useMemo<TFeeHistoryFilters | undefined>(() => {
    const nextFilters: TFeeHistoryFilters = {}

    if (feeTypeFilter !== "all") nextFilters.feeType = feeTypeFilter
    if (assetFilter !== "all") nextFilters.asset = assetFilter

    return Object.keys(nextFilters).length ? nextFilters : undefined
  }, [feeTypeFilter, assetFilter])

  const { data: feeHistory, isLoading } = useFeeHistory(
    limit,
    offset,
    search,
    filters
  )

  useEffect(() => {
    setOffset(0)
  }, [search, feeTypeFilter, assetFilter])

  const columns = useMemo<ColumnDef<TFeeRecord>[]>(
    () => [
      {
        accessorKey: "userId",
        header: "User",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.userId}</span>
        ),
      },
      {
        accessorKey: "asset",
        header: "Asset",
      },
      {
        accessorKey: "feeType",
        header: "Fee Type",
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${getFeeTypeClassName(
              row.original.feeType
            )}`}
          >
            {getFeeTypeLabel(row.original.feeType)}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatAmount(row.original.amount)}
          </span>
        ),
      },
      {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium capitalize">
              {row.original.referenceType}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.referenceId}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Time",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: feeHistory?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = feeHistory?.pagination.totalPages ?? 0

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Fee History</h2>
        <p className="text-sm text-muted-foreground">
          Log includes user, asset, fee type, amount, reference, and time.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search user, reference, asset..."
            className="pl-8"
          />
        </div>

        <Select
          value={feeTypeFilter}
          onValueChange={(value) =>
            setFeeTypeFilter(value as "all" | TFeeRecord["feeType"])
          }
        >
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Fee type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fee types</SelectItem>
            <SelectItem value="trading">Trading</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
          </SelectContent>
        </Select>

        <Select value={assetFilter} onValueChange={setAssetFilter}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Asset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assets</SelectItem>
            {assetOptions.map((asset) => (
              <SelectItem key={asset} value={asset}>
                {asset}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        {feeHistory?.data.length ?? 0} / {feeHistory?.pagination.total ?? 0}{" "}
        records
      </div>

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
                Array.from({ length: 8 }).map((_, index) => (
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
                  <TableRow key={row.id}>
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
                    className="h-24 text-center text-muted-foreground"
                  >
                    No fee history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(event) => {
                  event.preventDefault()
                  setOffset(Math.max(0, offset - limit))
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => {
              const isActive = offset / limit === index

              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={isActive}
                    onClick={(event) => {
                      event.preventDefault()
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
                onClick={(event) => {
                  event.preventDefault()
                  setOffset(
                    Math.min(
                      Math.max(totalPages - 1, 0) * limit,
                      offset + limit
                    )
                  )
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  )
}
