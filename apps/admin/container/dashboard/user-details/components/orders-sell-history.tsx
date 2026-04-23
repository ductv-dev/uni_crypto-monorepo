import { TOrderBook } from "@/types/transactions/orders-book.type"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { useMemo } from "react"

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "verified":
    case "confirmed":
    case "completed":
      return (
        <Badge className="flex items-center gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
          <CheckCircle2 className="size-3" /> {status}
        </Badge>
      )
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
        >
          <Clock className="size-3" /> {status}
        </Badge>
      )
    case "inactive":
    case "rejected":
    case "failed":
    case "canceled":
      return (
        <Badge
          variant="destructive"
          className="flex items-center gap-1 border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
        >
          <XCircle className="size-3" /> {status}
        </Badge>
      )
    case "partially_filled":
      return (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 border-blue-500/20 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
        >
          <Clock className="size-3" /> Chờ khớp một phần
        </Badge>
      )
    case "filled":
      return (
        <Badge className="flex items-center gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
          <CheckCircle2 className="size-3" /> Đã khớp
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

type Props = {
  data: TOrderBook[]
  isLoading: boolean
}

export const OrdersSellHistory: React.FC<Props> = ({ data, isLoading }) => {
  const columns = useMemo<ColumnDef<TOrderBook>[]>(
    () => [
      {
        accessorKey: "pair",
        header: "Cặp giao dịch",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("pair")}</span>
        ),
      },
      {
        accessorKey: "price",
        header: "Giá",
        cell: ({ row }) => {
          const price = row.getValue("price") as number
          return <span>${price.toLocaleString()}</span>
        },
      },
      {
        accessorKey: "amount",
        header: "Số lượng",
      },
      {
        id: "total",
        header: "Tổng trị giá",
        cell: ({ row }) => {
          const amount = row.original.amount
          const price = row.original.price
          return (
            <span className="font-semibold text-primary">
              ${(amount * price).toLocaleString()}
            </span>
          )
        },
      },
      {
        accessorKey: "created_at",
        header: "Thời gian",
        cell: ({ row }) => {
          const dateStr = row.getValue("created_at") as string
          return new Date(dateStr).toLocaleString("vi-VN")
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => getStatusBadge(row.getValue("status")),
      },
    ],
    []
  )

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Lịch sử lệnh bán</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
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
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
