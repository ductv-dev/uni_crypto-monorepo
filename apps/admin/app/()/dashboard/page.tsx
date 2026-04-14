import { CardDashboard } from "@/components/custom/card/card-dashboard"
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
import { Coins, User } from "lucide-react"

export default function Page() {
  const data = [
    {
      title: "Token",
      icon: <Coins />,
      items: [
        { title: "Overview", value: "100", trend: 10 },
        { title: "Real-time Stats", value: "200", trend: 20 },
      ],
    },
    {
      title: "User",
      icon: <User />,
      items: [
        { title: "Total", value: "100", trend: -12 },
        { title: "New", value: "200", trend: 20 },
      ],
    },
    {
      title: "Transaction",
      icon: <Coins />,
      items: [
        { title: "Total", value: "100", trend: -12 },
        { title: "New", value: "200", trend: 20 },
      ],
    },
    {
      title: "Trading",
      icon: <Coins />,
      items: [
        { title: "Total", value: "100", trend: -12 },
        { title: "New", value: "200", trend: 20 },
      ],
    },
  ]
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
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 xl:grid-cols-4">
          {data.map((item, index) => (
            <CardDashboard key={index} data={item} />
          ))}
        </div>
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </SidebarInset>
  )
}
