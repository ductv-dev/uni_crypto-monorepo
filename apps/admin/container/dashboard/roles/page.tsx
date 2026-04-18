"use client"

import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useDeleteRole } from "@/hooks/roles/use-delete-role"
import { useGetRoles } from "@/hooks/roles/use-roles"
import { TRole } from "@/types/role.type"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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
import { Dot, MoreHorizontal } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { FormCreateRole } from "./components/form-create-role"
import { FormUpdateRole } from "./components/form-update-role"
import { ManagePermissions } from "./components/manage-permissions"

export const Roles = () => {
  const { data: dataRoles, isLoading } = useGetRoles()
  const {
    mutate: deleteRole,
    isPending: isDeleting,
    isSuccess: isDeleteSuccess,
    reset: resetDeleteState,
  } = useDeleteRole()
  const [selectedRole, setSelectedRole] = useState<TRole | null>(null)

  useEffect(() => {
    if (!isDeleteSuccess) return

    setSelectedRole(null)
    resetDeleteState()
  }, [isDeleteSuccess, resetDeleteState])

  const columns = useMemo<ColumnDef<TRole>[]>(
    () => [
      {
        id: "index",
        header: "STT",
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      },
      {
        accessorKey: "name",
        header: "Tên vai trò",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
      },
      {
        accessorKey: "usersCount",
        header: "Số người dùng",
        cell: ({ row }) => (
          <span className="font-medium text-muted-foreground">
            {row.original.usersCount} người dùng
          </span>
        ),
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
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              <Dot className="mr-1 h-3 w-3" /> {status}
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
                  <FormUpdateRole role={row.original} />
                  <ManagePermissions role={row.original} />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => setSelectedRole(row.original)}
                  >
                    Xóa Vai trò
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
    data: dataRoles || [],
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
                <BreadcrumbLink href="/personnel">
                  Quản lý nhân sự
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Vai trò & phân quyền</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Vai trò & phân quyền
          </h1>
          <FormCreateRole />
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
                  Array.from({ length: 5 }).map((_, index) => (
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
                      Không tìm thấy vai trò nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!selectedRole}
        onOpenChange={(open) => {
          if (open) return
          setSelectedRole(null)
          resetDeleteState()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn xóa vai trò này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedRole
                ? `Hành động này không thể hoàn tác. Vai trò "${selectedRole.name}" sẽ bị xóa khỏi hệ thống và có thể ảnh hưởng đến người dùng hiện tại.`
                : "Hành động này không thể hoàn tác. Vai trò này sẽ bị xóa khỏi hệ thống và có thể ảnh hưởng đến người dùng hiện tại."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                if (!selectedRole) return
                deleteRole(selectedRole.id, {
                  onSuccess: () => {
                    toast.success("Xóa Vai trò thành công!")
                  },
                  onError: () => {
                    toast.error("Xóa thất bại")
                  },
                })
              }}
              disabled={isDeleting}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
}
