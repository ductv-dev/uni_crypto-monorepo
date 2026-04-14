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
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Search, ArrowUpCircle, Filter } from "lucide-react"

export default function WithdrawalPage() {
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
                <BreadcrumbLink href="/transactions">
                  Transactions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Withdrawals</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Withdrawal Requests
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Approve/Reject Filter
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Withdrawal Hash..."
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-4 text-center">
          <ArrowUpCircle className="mb-4 h-12 w-12 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">
            Withdrawal requests list with Approval mechanism will be here.
          </p>
        </div>
      </div>
    </SidebarInset>
  )
}
