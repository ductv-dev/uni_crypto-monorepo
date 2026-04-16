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
import { ArrowLeftRight, Coins, User } from "lucide-react"
import { SectionChart } from "./sections/section-chart"

export const OverviewPage: React.FC = () => {
  const data = [
    {
      title: "Token",
      icon: <Coins />,
      items: [
        { title: "Total Tokens", value: "14" },
        { title: "Active Tokens", value: "10" },
      ],
    },
    {
      title: "Users",
      icon: <User />,
      items: [
        { title: "Total Users", value: "321413223", unit: "Users" },
        { title: "New Users", value: "200", unit: "Users" },
      ],
    },
    {
      title: "Transaction",
      icon: <ArrowLeftRight />,
      items: [
        { title: "Deposit", value: "2301243", unit: "USDT" },
        { title: "Withdraw", value: "9283109", unit: "USDT" },
      ],
    },
    {
      title: "Assets",
      icon: <Coins />,
      items: [
        { title: "Total", value: "100" },
        { title: "New", value: "200" },
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
        <SectionChart />
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </SidebarInset>
  )
}
