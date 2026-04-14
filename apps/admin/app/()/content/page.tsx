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
import { FileText, Image as ImageIcon, Bell, MessageSquare } from "lucide-react"

export default function ContentManagementPage() {
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
                <BreadcrumbPage>Content Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold tracking-tight">
          Content Management
        </h1>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border bg-card p-6 transition-colors hover:bg-accent">
            <ImageIcon className="mb-2 h-8 w-8 text-primary" />
            <span className="font-semibold">Banners</span>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border bg-card p-6 transition-colors hover:bg-accent">
            <Bell className="mb-2 h-8 w-8 text-primary" />
            <span className="font-semibold">Notifications</span>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border bg-card p-6 transition-colors hover:bg-accent">
            <MessageSquare className="mb-2 h-8 w-8 text-primary" />
            <span className="font-semibold">FAQs</span>
          </div>
        </div>

        <div className="mt-4 flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-4 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">
            Manage all public-facing content and user communication.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}
