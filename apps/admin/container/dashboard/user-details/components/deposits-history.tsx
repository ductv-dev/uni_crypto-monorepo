import { TDeposits } from "@/types/transactions/deposits.type"
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
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

type Props = {
  data: TDeposits[]
  isLoading: boolean
}

export const DepositsHistory: React.FC<Props> = ({ data, isLoading }) => {
  const columns = useMemo<ColumnDef<TDeposits>[]>(
    () => [
      {
        accessorKey: "asset",
        header: "Tài sản",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("asset")}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Số lượng",
        cell: ({ row }) => (
          <span className="font-bold text-emerald-600">
            +{row.getValue("amount")}
          </span>
        ),
      },
      {
        accessorKey: "network",
        header: "Mạng lưới",
      },
      {
        accessorKey: "tx_hash",
        header: "TxHash",
        cell: ({ row }) => {
          const txHash = row.getValue("tx_hash") as string
          return (
            <span
              className="block max-w-[150px] truncate font-mono text-xs text-muted-foreground"
              title={txHash}
            >
              {txHash}
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
        <CardTitle className="text-lg">Lịch sử nạp tiền</CardTitle>
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
