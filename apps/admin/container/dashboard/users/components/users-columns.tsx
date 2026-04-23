"use client"

import { TUser } from "@/types/user.type"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { UserQuickEdit } from "./user-quick-edit"
import { UserStatusBadge } from "./user-status-badge"
import { UserWalletsView } from "./user-wallets"

export const getUserColumns = (): ColumnDef<TUser>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.getValue("email")}>
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "id_number",
    header: "ID Number",
  },
  {
    accessorKey: "id_type",
    header: "ID Type",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <UserStatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="space-y-2 p-2">
            <Link
              href={`/users/${row.original.id}`}
              className="hover:text-brand-primary flex items-center gap-1 p-1 text-sm"
            >
              <Eye size={14} /> Xem chi tiết
            </Link>
            <UserWalletsView id={row.original.id} />
            <UserQuickEdit user={row.original} />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
