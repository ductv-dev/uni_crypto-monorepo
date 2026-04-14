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
import { Settings2 } from "lucide-react"

export default function SettingsPage() {
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
                <BreadcrumbPage>System Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Settings
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Trading Fees</h2>
            <p className="text-sm text-muted-foreground">
              Adjust Maker and Taker fees across different tiers.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Withdrawal Limits</h2>
            <p className="text-sm text-muted-foreground">
              Configure daily and monthly limits based on KYC levels.
            </p>
          </div>
        </div>

        <div className="mt-4 flex min-h-[200px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-4 text-center">
          <Settings2 className="mb-4 h-12 w-12 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">
            Global system parameters and limits configuration.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}
