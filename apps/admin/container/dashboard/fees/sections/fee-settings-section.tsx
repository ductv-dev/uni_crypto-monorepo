import { TFeeConfig } from "@/data/mock-data-fee"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { FeeConfigCard } from "../components/fee-config-card"

type Props = {
  configs: TFeeConfig[]
  isLoading: boolean
  lastSavedAt: string | null
  onSaveConfig: (nextConfig: TFeeConfig) => void
}

export const FeeSettingsSection: React.FC<Props> = ({
  configs,
  isLoading,
  lastSavedAt,
  onSaveConfig,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Fee Settings</h2>
        <p className="text-sm text-muted-foreground">
          Fee setting cards only display overview values. Use the edit button to
          open dialog and update each asset.
        </p>
      </div>

      <div className="rounded-lg border border-dashed bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        {lastSavedAt
          ? `Last local update: ${lastSavedAt}`
          : "No local updates yet."}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[230px] w-full" />
            ))
          : configs.map((config) => (
              <FeeConfigCard
                key={config.asset}
                config={config}
                onSave={onSaveConfig}
              />
            ))}
      </div>
    </section>
  )
}
