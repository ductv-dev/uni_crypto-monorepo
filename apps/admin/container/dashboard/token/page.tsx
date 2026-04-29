"use client"
import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useDataToken } from "@/hooks/token/use-data-token"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { TToken } from "@workspace/shared/types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
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
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { DialogCreateToken } from "./components/dialog-create-token"
import { DrawerTokenStatus } from "./components/drawer-token-status"
import { TokensPagination } from "./components/tokens-pagiation"

const TokenActions = ({ token }: { token: TToken }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="flex flex-col space-y-1 p-1">
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(event) => {
                event.preventDefault()
                setIsDropdownOpen(false)
                setIsDrawerOpen(true)
              }}
            >
              Quản lý token
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive">
              Khóa token
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DrawerTokenStatus
        token={token}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </>
  )
}

export const TokenManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("")
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
  })
  const { data: dataToken, isLoading } = useDataToken(
    searchQueryDebounced,
    pagination.limit,
    pagination.offset
  )
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const totalPages = dataToken?.pagination.totalPages || 0

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQueryDebounced(value)
      }, 500),
    []
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    debouncedSearch(value)
  }

  const stats = useMemo(() => {
    if (!dataToken) return { total: 0, deposit: 0, withdraw: 0, trading: 0 }
    return {
      total: dataToken.data.length,
      deposit: dataToken.data.filter((t) => t.isDepositEnabled).length,
      withdraw: dataToken.data.filter((t) => t.isWithdrawEnabled).length,
      trading: dataToken.data.filter((t) => t.isTradingEnabled).length,
    }
  }, [dataToken])

  const columns = useMemo<ColumnDef<TToken>[]>(
    () => [
      {
        id: "index",
        header: "STT",
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      },
      {
        accessorKey: "information",
        header: "Thông tin",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {row.original.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.symbol}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "logoURI",
        header: "Logo",
        cell: ({ row }) => (
          <Avatar className="h-9 w-9 shrink-0 bg-white">
            <AvatarImage
              src={row.original.logoURI}
              alt={`${row.original.name} logo`}
            />
            <AvatarFallback className="text-xs">
              {row.original.name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
        ),
      },

      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const isDeposit = row.original.isDepositEnabled === true
          const isWithdraw = row.original.isWithdrawEnabled === true
          const isTrading = row.original.isTradingEnabled === true

          return (
            <div className="flex gap-1">
              <span
                className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  isDeposit
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                Deposit: {isDeposit ? "On" : "Off"}
              </span>
              <span
                className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  isWithdraw
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                Withdraw: {isWithdraw ? "On" : "Off"}
              </span>
              <span
                className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  isTrading
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                Trading: {isTrading ? "On" : "Off"}
              </span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => <TokenActions token={row.original} />,
      },
    ],
    []
  )
  const table = useReactTable({
    data: dataToken?.data || [],
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
                <BreadcrumbLink href="/assets">Assets</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Token Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Tokens</h1>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Token
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng số Token
              </CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Đang niêm yết trên sàn
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cổng Nạp (Mở)
              </CardTitle>
              <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.deposit}
              </div>
              <p className="text-xs text-muted-foreground">
                Token cho phép nạp
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cổng Rút (Mở)
              </CardTitle>
              <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.withdraw}
              </div>
              <p className="text-xs text-muted-foreground">
                Token cho phép rút
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Giao Dịch (Mở)
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.trading}
              </div>
              <p className="text-xs text-muted-foreground">
                Token đang giao dịch
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by Symbol or Contract..."
              className="pl-8"
            />
          </div>
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
                      Không tìm thấy nhân sự nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <TokensPagination
          pagination={pagination}
          totalPages={totalPages}
          onChange={setPagination}
        />
        <DialogCreateToken open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
    </SidebarInset>
  )
}
