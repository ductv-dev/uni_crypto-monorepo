"use client"

import {
  CardWalletSystemOverview,
  CardWalletSystemOverviewSkeleton,
} from "@/components/custom/card/card-wallet-system-overview"
import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { useWalletSystemOverview } from "@/hooks/system-wallet/use-wallet-system-overview"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { AlertTriangle, Landmark, Layers3, Wallet } from "lucide-react"

const formatBalance = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value)
}

export const WalletTreasury = () => {
  const { data: walletOverview, isLoading } = useWalletSystemOverview()

  const totalSystemBalance =
    walletOverview?.reduce(
      (walletTotal, wallet) =>
        walletTotal +
        wallet.total.reduce((assetTotal, asset) => assetTotal + asset.total, 0),
      0
    ) ?? 0

  const trackedAssets = walletOverview?.[0]?.total.length ?? 0
  const walletGroups = walletOverview?.length ?? 0
  const maintenanceAlerts = 0

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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total System Balance
                  </p>
                  <p className="text-2xl font-bold tabular-nums">
                    {isLoading ? "..." : formatBalance(totalSystemBalance)}
                  </p>
                </div>
                <div className="rounded-full bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                  <Wallet className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Wallet Groups
                  </p>
                  <p className="text-2xl font-bold">{walletGroups}</p>
                </div>
                <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                  <Landmark className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Tracked Assets
                  </p>
                  <p className="text-2xl font-bold">{trackedAssets}</p>
                </div>
                <div className="rounded-full bg-violet-500/10 p-2.5 text-violet-600 dark:text-violet-400">
                  <Layers3 className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/40 bg-yellow-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Wallet Alerts
                  </p>
                  <p className="text-2xl font-bold">{maintenanceAlerts}</p>
                  <p className="text-xs text-muted-foreground">
                    No maintenance warnings at this time.
                  </p>
                </div>
                <div className="rounded-full bg-yellow-500/10 p-2.5 text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold tracking-tight">
              System Wallet Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Monitor balances grouped by wallet function across the exchange
              treasury.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <CardWalletSystemOverviewSkeleton key={index} />
                ))
              : walletOverview?.map((item) => (
                  <CardWalletSystemOverview key={item.wallet} data={item} />
                ))}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
