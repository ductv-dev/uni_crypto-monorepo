import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import { UserPlus, ShieldAlert } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function PersonnelPage() {
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
              <BreadcrumbItem>
                <BreadcrumbPage>Personnel</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Personnel & RBAC
          </h1>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Admin
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <UserPlus className="h-4 w-4" /> Admin Accounts
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage internal team members and their activity.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="h-4 w-4" /> Roles & Permissions
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Define access levels: Support, Compliance, Manager, etc.
            </p>
          </div>
        </div>

        <div className="mt-4 flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-4 text-center">
          <p className="text-muted-foreground">
            Personnel list with Role-Based Access Control configuration will be
            here.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}
