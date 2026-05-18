"use client"

import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useCreateMarket } from "@/hooks/market/use-create-market"
import { useDeleteMarket } from "@/hooks/market/use-delete-market"
import { useMarketAssets } from "@/hooks/market/use-market-assets"
import { useMarkets } from "@/hooks/market/use-markets"
import { useUpdateMarket } from "@/hooks/market/use-update-market"
import {
  type TCreateMarketPayload,
  type TMarket,
  type TUpdateMarketPayload,
} from "@/types/market.type"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Switch } from "@workspace/ui/components/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { toast } from "@workspace/ui/index"
import { debounce } from "lodash"
import {
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Trash2Icon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type TCreateFormState = {
  symbol: string
  base_asset_id: string
  quote_asset_id: string
  min_order_amount: string
  max_order_amount: string
  min_order_value: string
  price_precision: string
  quantity_precision: string
  description: string
  status: boolean
}

type TEditFormState = {
  min_order_amount: string
  max_order_amount: string
  min_order_value: string
  price_precision: string
  quantity_precision: string
  description: string
  status: boolean
}

const DEFAULT_CREATE_FORM: TCreateFormState = {
  symbol: "",
  base_asset_id: "",
  quote_asset_id: "",
  min_order_amount: "0",
  max_order_amount: "",
  min_order_value: "0",
  price_precision: "2",
  quantity_precision: "6",
  description: "",
  status: true,
}

const parseNumber = (value: string) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const toCreatePayload = (form: TCreateFormState): TCreateMarketPayload => {
  if (!form.base_asset_id.trim()) {
    throw new Error("Please select base asset")
  }

  if (!form.quote_asset_id.trim()) {
    throw new Error("Please select quote asset")
  }

  if (form.base_asset_id === form.quote_asset_id) {
    throw new Error("Base asset and quote asset must be different")
  }

  const minOrderAmount = parseNumber(form.min_order_amount)
  if (minOrderAmount === null || minOrderAmount < 0) {
    throw new Error("Min order amount is invalid")
  }

  const payload: TCreateMarketPayload = {
    symbol: form.symbol.trim().toUpperCase(),
    base_asset_id: form.base_asset_id.trim(),
    quote_asset_id: form.quote_asset_id.trim(),
    min_order_amount: minOrderAmount,
    status: form.status,
  }

  const maxOrderAmount = parseNumber(form.max_order_amount)
  if (form.max_order_amount.trim()) {
    if (maxOrderAmount === null || maxOrderAmount < 0) {
      throw new Error("Max order amount is invalid")
    }
    payload.max_order_amount = maxOrderAmount
  }

  const minOrderValue = parseNumber(form.min_order_value)
  if (form.min_order_value.trim()) {
    if (minOrderValue === null || minOrderValue < 0) {
      throw new Error("Min order value is invalid")
    }
    payload.min_order_value = minOrderValue
  }

  const pricePrecision = parseNumber(form.price_precision)
  if (form.price_precision.trim()) {
    if (pricePrecision === null || pricePrecision < 0) {
      throw new Error("Price precision is invalid")
    }
    payload.price_precision = pricePrecision
  }

  const quantityPrecision = parseNumber(form.quantity_precision)
  if (form.quantity_precision.trim()) {
    if (quantityPrecision === null || quantityPrecision < 0) {
      throw new Error("Quantity precision is invalid")
    }
    payload.quantity_precision = quantityPrecision
  }

  if (form.description.trim()) {
    payload.description = form.description.trim()
  }

  return payload
}

const toEditPayload = (form: TEditFormState): TUpdateMarketPayload => {
  const payload: TUpdateMarketPayload = {
    status: form.status,
    description: form.description.trim() || undefined,
  }

  const minOrderAmount = parseNumber(form.min_order_amount)
  if (minOrderAmount !== null) {
    payload.min_order_amount = minOrderAmount
  }

  const maxOrderAmount = parseNumber(form.max_order_amount)
  if (form.max_order_amount.trim()) {
    if (maxOrderAmount === null || maxOrderAmount < 0) {
      throw new Error("Max order amount is invalid")
    }
    payload.max_order_amount = maxOrderAmount
  } else {
    payload.max_order_amount = undefined
  }

  const minOrderValue = parseNumber(form.min_order_value)
  if (minOrderValue !== null) {
    payload.min_order_value = minOrderValue
  }

  const pricePrecision = parseNumber(form.price_precision)
  if (pricePrecision !== null) {
    payload.price_precision = pricePrecision
  }

  const quantityPrecision = parseNumber(form.quantity_precision)
  if (quantityPrecision !== null) {
    payload.quantity_precision = quantityPrecision
  }

  return payload
}

const numberDisplay = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") {
    return "-"
  }

  const parsed = Number(value)
  return Number.isFinite(parsed)
    ? parsed.toLocaleString("en-US")
    : String(value)
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

const getStatusTextClass = (status: boolean) =>
  status
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
    : "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"

type TMarketActionsProps = {
  market: TMarket
}

const MarketActions: React.FC<TMarketActionsProps> = ({ market }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [form, setForm] = useState<TEditFormState>({
    min_order_amount: String(market.min_order_amount ?? 0),
    max_order_amount:
      market.max_order_amount === null || market.max_order_amount === undefined
        ? ""
        : String(market.max_order_amount),
    min_order_value: String(market.min_order_value ?? 0),
    price_precision: String(market.price_precision ?? 2),
    quantity_precision: String(market.quantity_precision ?? 6),
    description: market.description || "",
    status: market.status,
  })
  const updateMarketMutation = useUpdateMarket()
  const deleteMarketMutation = useDeleteMarket()

  const handleSave = async () => {
    try {
      const payload = toEditPayload(form)
      await updateMarketMutation.mutateAsync({
        id: market.id,
        payload,
      })
      toast.success(`Updated market ${market.symbol}`)
      setIsEditOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update market"
      )
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMarketMutation.mutateAsync(market.id)
      toast.success(`Deleted market ${market.symbol}`)
      setIsDeleteOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete market"
      )
    }
  }

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setForm({
                min_order_amount: String(market.min_order_amount ?? 0),
                max_order_amount:
                  market.max_order_amount === null ||
                  market.max_order_amount === undefined
                    ? ""
                    : String(market.max_order_amount),
                min_order_value: String(market.min_order_value ?? 0),
                price_precision: String(market.price_precision ?? 2),
                quantity_precision: String(market.quantity_precision ?? 6),
                description: market.description || "",
                status: market.status,
              })
              setIsEditOpen(true)
            }}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive"
            onSelect={(event) => {
              event.preventDefault()
              setIsDropdownOpen(false)
              setIsDeleteOpen(true)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Edit Market {market.symbol}</DialogTitle>
            <DialogDescription>
              Symbol and asset pair are immutable. You can update thresholds,
              precision and status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Symbol</Label>
                <Input value={market.symbol} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Pair Assets</Label>
                <Input
                  value={`${market.baseAsset?.symbol || market.base_asset_id} / ${market.quoteAsset?.symbol || market.quote_asset_id}`}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Min Order Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={form.min_order_amount}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      min_order_amount: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max Order Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={form.max_order_amount}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      max_order_amount: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Min Order Value</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={form.min_order_value}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      min_order_value: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Price Precision</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.price_precision}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      price_precision: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Quantity Precision</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.quantity_precision}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      quantity_precision: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Description"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.status}
                id={`status-${market.id}`}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, status: checked }))
                }
              />
              <Label htmlFor={`status-${market.id}`}>Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateMarketMutation.isPending}
            >
              {updateMarketMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete market?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove market <strong>{market.symbol}</strong>.
              If the market has orders or trades, backend will reject deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMarketMutation.isPending}
            >
              {deleteMarketMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const MarketManagement = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all")
  const [page, setPage] = useState(1)
  const limit = 10
  const [createForm, setCreateForm] =
    useState<TCreateFormState>(DEFAULT_CREATE_FORM)
  const createMarketMutation = useCreateMarket()
  const { data: assetList = [], isLoading: isLoadingAssets } = useMarketAssets()

  const { data, isLoading, isFetching } = useMarkets({
    search,
    status,
    page,
    limit,
  })

  const totalPages = data?.meta.totalPages || 0
  const marketList = data?.data || []
  const assetById = useMemo(
    () => new Map(assetList.map((asset) => [asset.id, asset])),
    [assetList]
  )

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value)
        setPage(1)
      }, 400),
    []
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const onCreateMarket = async () => {
    try {
      const payload = toCreatePayload(createForm)
      await createMarketMutation.mutateAsync(payload)
      toast.success(`Created market ${payload.symbol}`)
      setCreateForm(DEFAULT_CREATE_FORM)
      setIsCreateOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create market"
      )
    }
  }

  const handleBaseAssetChange = (assetId: string) => {
    setCreateForm((prev) => {
      const next = { ...prev, base_asset_id: assetId }
      const baseSymbol = assetById.get(next.base_asset_id)?.symbol
      const quoteSymbol = assetById.get(next.quote_asset_id)?.symbol

      if (baseSymbol && quoteSymbol) {
        next.symbol = `${baseSymbol}/${quoteSymbol}`
      }

      return next
    })
  }

  const handleQuoteAssetChange = (assetId: string) => {
    setCreateForm((prev) => {
      const next = { ...prev, quote_asset_id: assetId }
      const baseSymbol = assetById.get(next.base_asset_id)?.symbol
      const quoteSymbol = assetById.get(next.quote_asset_id)?.symbol

      if (baseSymbol && quoteSymbol) {
        next.symbol = `${baseSymbol}/${quoteSymbol}`
      }

      return next
    })
  }

  const columns = useMemo<ColumnDef<TMarket>[]>(
    () => [
      {
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.symbol}</span>
        ),
      },
      {
        id: "pair",
        header: "Pair",
        cell: ({ row }) => (
          <span>
            {row.original.baseAsset?.symbol || row.original.base_asset_id} /{" "}
            {row.original.quoteAsset?.symbol || row.original.quote_asset_id}
          </span>
        ),
      },
      {
        accessorKey: "min_order_amount",
        header: "Min Qty",
        cell: ({ row }) => (
          <span>{numberDisplay(row.original.min_order_amount)}</span>
        ),
      },
      {
        accessorKey: "max_order_amount",
        header: "Max Qty",
        cell: ({ row }) => (
          <span>{numberDisplay(row.original.max_order_amount)}</span>
        ),
      },
      {
        accessorKey: "min_order_value",
        header: "Min Value",
        cell: ({ row }) => (
          <span>{numberDisplay(row.original.min_order_value)}</span>
        ),
      },
      {
        accessorKey: "precision",
        header: "Precision",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            P:{row.original.price_precision} / Q:
            {row.original.quantity_precision}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusTextClass(row.original.status)}`}
          >
            {row.original.status ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ row }) => (
          <span className="text-xs">
            {formatDateTime(row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <MarketActions market={row.original} />,
      },
    ],
    []
  )

  const table = useReactTable({
    data: marketList,
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/assets/tokens">Assets</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Market Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Trading Pairs</CardTitle>
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Market
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => {
                    const value = event.target.value
                    setSearchInput(value)
                    debouncedSearch(value)
                  }}
                  placeholder="Search by symbol or description"
                  className="pl-9"
                />
              </div>
              <Select
                value={status}
                onValueChange={(value: "all" | "active" | "inactive") => {
                  setStatus(value)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
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
                    Array.from({ length: limit }).map((_, index) => (
                      <TableRow key={`market-loading-${index}`}>
                        <TableCell colSpan={columns.length}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : table.getRowModel().rows.length ? (
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
                        className="py-8 text-center"
                      >
                        No market found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                Page {data?.meta.page || 1} / {totalPages || 1}{" "}
                {isFetching && !isLoading ? "(updating...)" : ""}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    totalPages === 0 || page >= totalPages || isFetching
                  }
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Market</DialogTitle>
            <DialogDescription>
              Create a trading pair by selecting real assets from backend.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Symbol</Label>
                <Input
                  value={createForm.symbol}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      symbol: event.target.value,
                    }))
                  }
                  placeholder="BTC/USDT"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Base Asset</Label>
                <Select
                  value={createForm.base_asset_id || undefined}
                  onValueChange={handleBaseAssetChange}
                  disabled={isLoadingAssets}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select base asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetList.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.symbol} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Quote Asset</Label>
                <Select
                  value={createForm.quote_asset_id || undefined}
                  onValueChange={handleQuoteAssetChange}
                  disabled={isLoadingAssets}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quote asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetList.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.symbol} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Min Order Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={createForm.min_order_amount}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      min_order_amount: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max Order Amount</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={createForm.max_order_amount}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      max_order_amount: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Min Order Value</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={createForm.min_order_value}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      min_order_value: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Price Precision</Label>
                <Input
                  type="number"
                  min="0"
                  value={createForm.price_precision}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      price_precision: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Quantity Precision</Label>
                <Input
                  type="number"
                  min="0"
                  value={createForm.quantity_precision}
                  onChange={(event) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      quantity_precision: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input
                value={createForm.description}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Market description"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={createForm.status}
                id="create-market-status"
                onCheckedChange={(checked) =>
                  setCreateForm((prev) => ({ ...prev, status: checked }))
                }
              />
              <Label htmlFor="create-market-status">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={onCreateMarket}
              disabled={createMarketMutation.isPending}
            >
              {createMarketMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}
