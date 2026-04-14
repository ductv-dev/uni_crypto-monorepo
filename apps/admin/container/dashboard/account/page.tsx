"use client"
import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useAdmin } from "@/store/admin-store"

import { roleLabel } from "@/lib/config/role-config"
import { TRole } from "@/types/admin.type"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import { Crown, Shield } from "lucide-react"
import { History } from "./components/history"
import { Information } from "./components/information"
import { Permission } from "./components/permission"
const permissions = [
  {
    id: 1,
    name: "User Management",
    description: "Manage user accounts",
    actions: ["create", "read", "update", "delete"],
  },
  {
    id: 2,
    name: "Product Management",
    description: "Manage product inventory",
    actions: ["create", "read", "update", "delete"],
  },
  {
    id: 3,
    name: "Order Management",
    description: "Manage customer orders",
    actions: ["create", "read", "update", "delete"],
  },
]
const data = [
  {
    id: "1",
    action: "Duyệt tài khoản khách hàng ID: hfiuwegfiuw",
    date: 1713100000000,
  },
  {
    id: "2",
    action: "Khóa tài khoản khách hàng ID: hfiuwegfiuw",
    date: 1713100000000,
  },
  {
    id: "3",
    action: "Duyệt tài khoản khách hàng ID: hfiuwegfiuw",
    date: 1713100000000,
  },
  {
    id: "4",
    action: "Duyệt tài khoản khách hàng ID: hfiuwegfiuw",
    date: 1713100000000,
  },
  {
    id: "5",
    action: "Duyệt tài khoản khách hàng ID: hfiuwegfiuw",
    date: 1713100000000,
  },
  {
    id: "6",
    action: "Duyệt tài khoản khách hàng ID: hfiuwegfiuw",
    date: 1713100000000,
  },
]
export const Account = () => {
  const roleIcon: Record<TRole, React.ReactNode> = {
    super_admin: <Crown className="size-4 text-yellow-500" />,
    admin: <Shield className="size-4 text-primary" />,
  }
  const admin = useAdmin((state) => state.admin)

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
                <BreadcrumbLink href="/account">Account</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Information admin={admin} />
          <History data={data} />
        </div>

        <div>
          <Permission
            permissions={permissions}
            roleIcon={roleIcon}
            roleLabel={roleLabel}
            admin={admin}
          />
        </div>
      </div>
    </SidebarInset>
  )
}
