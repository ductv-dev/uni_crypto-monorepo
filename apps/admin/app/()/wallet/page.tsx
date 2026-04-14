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
import { Wallet, AlertTriangle } from "lucide-react"

export default function WalletTreasuryPage() {
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
                <BreadcrumbPage>Wallet & Treasury</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Wallet & Treasury
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Wallet className="h-4 w-4" /> System Balance
            </div>
            <div className="mt-2 text-2xl font-bold">$0.00</div>
          </div>
          <div className="rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-yellow-600">
              <AlertTriangle className="h-4 w-4" /> Gas Alerts
            </div>
            <div className="mt-2 text-sm">No warnings at this time.</div>
          </div>
        </div>

        <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-4 text-center">
          <p className="text-muted-foreground">
            Blockchain bridge monitoring and system wallet overview will be
            shown here.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}
