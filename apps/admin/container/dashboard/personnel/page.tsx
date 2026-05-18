"use client"

import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useTogglePersonnelBlock } from "@/hooks/personnel/use-toggle-personnel-block"
import { usePersonnel } from "@/hooks/personnel/use-personnel"
import { useGetRoles } from "@/hooks/roles/use-roles"
import { formatDateTime } from "@/lib/utils/fees"
import { TPersonnel } from "@/types/personnel.type"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group"
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
import { toast } from "@workspace/ui/index"
import { debounce } from "lodash"
import {
  Dot,
  Filter,
  Lock,
  LockOpen,
  MoreHorizontal,
  Search,
  ShieldAlert,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { FormCreatePersonnel } from "./components/form-create-personnel"
import { FormUpdatePersonnel } from "./components/form-update-personnel"
import { PersonnelDetailView } from "./components/personnel-detail-view"

type TPagination = {
  limit: number
  offset: number
}

export const Personnel = () => {
  const [pagination, setPagination] = useState<TPagination>({
    limit: 10,
    offset: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryDebounced, setSearchQueryDebounced] = useState("")
  const [filter, setFilter] = useState({
    status: "",
    role: "",
  })
  const { data: dataPersonnel, isLoading } = usePersonnel(
    pagination.limit,
    pagination.offset,
    searchQuery,
    filter
  )
  const { data: roles = [] } = useGetRoles()
  const {
    mutate: togglePersonnelBlock,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    reset: resetDeleteState,
  } = useTogglePersonnelBlock()
  const [selectedPersonnel, setSelectedPersonnel] = useState<TPersonnel | null>(
    null
  )
  const totalPages = dataPersonnel?.pagination.totalPages || 0

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

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter)
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  useEffect(() => {
    if (!isDeleteSuccess) return

    setSelectedPersonnel(null)
    resetDeleteState()
  }, [isDeleteSuccess, resetDeleteState])

  const columns = useMemo<ColumnDef<TPersonnel>[]>(
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
              {row.original.fullName}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Vai trò",
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      {
        accessorKey: "updatedAt",
        header: "Cập nhật gần nhất",
        cell: ({ row }) => formatDateTime(row.original.updatedAt),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = row.getValue("status") as string

          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : status === "inactive"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              <Dot className="mr-1 h-3 w-3" />{" "}
              {status === "active"
                ? "Hoạt động"
                : status === "inactive"
                  ? "Ngừng hoạt động"
                  : "Đã khóa"}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex flex-col space-y-1 p-1">
                  <PersonnelDetailView personnel={row.original} />
                  <FormUpdatePersonnel personnel={row.original} />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => setSelectedPersonnel(row.original)}
                  >
                    {row.original.status === "blocked" ? (
                      <>
                        <LockOpen className="mr-2 h-4 w-4" />
                        Mở khóa tài khoản
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Khóa tài khoản
                      </>
                    )}
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: dataPersonnel?.data || [],
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
                <BreadcrumbLink href="/dashboard">
                  Bảng điều khiển
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tài khoản quản trị</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Tài khoản quản trị & phân quyền
          </h1>
          <div className="flex items-center gap-2">
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Bộ lọc nâng cao
                </Button>
              </DrawerTrigger>
              <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
                <DrawerHeader>
                  <DrawerTitle>Bộ lọc nâng cao</DrawerTitle>
                </DrawerHeader>
                <div className="no-scrollbar overflow-y-auto px-4">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2.5">
                      <Label>Trạng thái</Label>
                      <RadioGroup
                        value={filter.status}
                        onValueChange={(value) =>
                          handleFilterChange({ ...filter, status: value })
                        }
                        className="w-fit"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="" id="personnel-status-all" />
                          <Label htmlFor="personnel-status-all">Tất cả</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="active"
                            id="personnel-status-active"
                          />
                          <Label htmlFor="personnel-status-active">
                            Hoạt động
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="inactive"
                            id="personnel-status-inactive"
                          />
                          <Label htmlFor="personnel-status-inactive">
                            Không hoạt động
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="blocked"
                            id="personnel-status-blocked"
                          />
                          <Label htmlFor="personnel-status-blocked">
                            Đã khóa
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <Label>Vị trí</Label>
                      <RadioGroup
                        value={filter.role}
                        onValueChange={(value) =>
                          handleFilterChange({ ...filter, role: value })
                        }
                        className="w-fit"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="" id="personnel-role-all" />
                          <Label htmlFor="personnel-role-all">Tất cả</Label>
                        </div>
                        {roles.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-center gap-3"
                          >
                            <RadioGroupItem
                              value={role.id}
                              id={`personnel-role-${role.id}`}
                            />
                            <Label htmlFor={`personnel-role-${role.id}`}>
                              {role.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button>Áp dụng</Button>
                  </DrawerClose>
                  <Button
                    variant="outline"
                    onClick={() => handleFilterChange({ status: "", role: "" })}
                  >
                    Đặt lại
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Link href="/personnel/roles">
              <Button variant="outline" size="sm">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Quản lý vai trò
              </Button>
            </Link>
            <FormCreatePersonnel />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative max-w-sm min-w-[240px] flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQueryDebounced}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Tìm theo email, tên hiển thị, vai trò..."
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
                      Không tìm thấy tài khoản quản trị nào.
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

      <AlertDialog
        open={!!selectedPersonnel}
        onOpenChange={(open) => {
          if (open) return
          setSelectedPersonnel(null)
          resetDeleteState()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPersonnel?.status === "blocked"
                ? "Bạn có chắc muốn mở khóa tài khoản này?"
                : "Bạn có chắc muốn khóa tài khoản này?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPersonnel
                ? selectedPersonnel.status === "blocked"
                  ? `Tài khoản "${selectedPersonnel.fullName}" (${selectedPersonnel.email}) sẽ được mở khóa và có thể đăng nhập trở lại.`
                  : `Tài khoản "${selectedPersonnel.fullName}" (${selectedPersonnel.email}) sẽ bị khóa tạm thời và không thể sử dụng hệ thống cho đến khi được mở khóa.`
                : "Trạng thái khóa của tài khoản đã chọn sẽ được cập nhật."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                if (!selectedPersonnel) return
                togglePersonnelBlock(selectedPersonnel.id, {
                  onSuccess: () => {
                    toast.success(
                      selectedPersonnel.status === "blocked"
                        ? "Mở khóa tài khoản thành công!"
                        : "Khóa tài khoản thành công!"
                    )
                  },
                  onError: () => {
                    toast.error("Cập nhật trạng thái tài khoản thất bại")
                  },
                })
              }}
              disabled={isDeleting}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              {isDeleting
                ? "Đang cập nhật..."
                : selectedPersonnel?.status === "blocked"
                  ? "Mở khóa"
                  : "Khóa tài khoản"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
