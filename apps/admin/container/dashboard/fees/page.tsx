"use client"

import { SidebarInset, SidebarTrigger } from "@/components/layout/sidebar"
import { TFeeConfig } from "@/data/mock-data-fee"
import { useFeeConfigs } from "@/hooks/settings/use-fee-configs"
import { useFeeRevenueOverview } from "@/hooks/settings/use-fee-revenue-overview"
import { formatAmount, formatDateTime } from "@/lib/utils/fees"
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
import { Activity, Coins, ReceiptText, Settings2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { FeeHistorySection } from "./sections/fee-history-section"
import { FeeRevenueSection } from "./sections/fee-revenue-section"
import { FeeSettingsSection } from "./sections/fee-settings-section"

export const FeesManagement = () => {
  const { data: feeConfigs, isLoading: isLoadingConfigs } = useFeeConfigs()
  const { data: revenueOverview, isLoading: isLoadingRevenue } =
    useFeeRevenueOverview()

  const [draftConfigs, setDraftConfigs] = useState<TFeeConfig[]>([])
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  useEffect(() => {
    if (feeConfigs) {
      setDraftConfigs(feeConfigs.map((config) => ({ ...config })))
    }
  }, [feeConfigs])

  const totalAssetsConfigured = draftConfigs.length
  const totalActiveConfigs = draftConfigs.filter(
    (config) => config.isActive
  ).length

  const handleSaveConfig = (nextConfig: TFeeConfig) => {
    setDraftConfigs((current) =>
      current.map((config) =>
        config.asset === nextConfig.asset ? nextConfig : config
      )
    )
    setLastSavedAt(formatDateTime(new Date().toISOString()))
  }

  const feeEventsToday = useMemo(() => {
    return revenueOverview?.totalRecordsToday ?? 0
  }, [revenueOverview])

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
                <BreadcrumbLink href="/settings">
                  System Settings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Fees & Commissions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Fees & Commissions
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage fee settings, review fee revenue, and monitor fee history in
            one place.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Today&apos;s Fee Revenue
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">
                    {isLoadingRevenue
                      ? "..."
                      : formatAmount(revenueOverview?.totalTodayRevenue ?? 0)}
                  </p>
                </div>
                <div className="rounded-full bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                  <Coins className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fee Events Today
                  </p>
                  <p className="mt-1 text-2xl font-bold">{feeEventsToday}</p>
                </div>
                <div className="rounded-full bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                  <ReceiptText className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Assets Generating Fees
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {revenueOverview?.activeAssetsToday ?? 0}
                  </p>
                </div>
                <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Fee Configs
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {totalActiveConfigs}/{totalAssetsConfigured}
                  </p>
                </div>
                <div className="rounded-full bg-violet-500/10 p-2.5 text-violet-600 dark:text-violet-400">
                  <Settings2 className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <FeeSettingsSection
          configs={draftConfigs}
          isLoading={isLoadingConfigs}
          lastSavedAt={lastSavedAt}
          onSaveConfig={handleSaveConfig}
        />

        <FeeRevenueSection
          data={revenueOverview}
          isLoading={isLoadingRevenue}
        />

        <div className="min-h-screen">
          <FeeHistorySection />
        </div>
      </div>
    </SidebarInset>
  )
}
