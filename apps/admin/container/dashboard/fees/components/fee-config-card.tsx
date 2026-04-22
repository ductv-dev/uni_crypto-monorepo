import { TFeeConfig } from "@/data/mock-data-fee"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { FeeConfigEditDialog } from "./fee-config-edit-dialog"

type Props = {
  config: TFeeConfig
  onSave: (nextConfig: TFeeConfig) => void
}

export const FeeConfigCard: React.FC<Props> = ({ config, onSave }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{config.asset}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Fee rules by asset
            </p>
          </div>
          <Badge
            variant={config.isActive ? "default" : "outline"}
            className={
              config.isActive
                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                : ""
            }
          >
            {config.isActive ? "Active" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
          <span className="text-sm text-muted-foreground">Trading fee %</span>
          <span className="text-sm font-semibold">
            {config.tradingFeePercent}%
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            Withdraw fee flat
          </span>
          <span className="text-sm font-semibold">
            {config.withdrawFeeFlat}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            Deposit fee flat
          </span>
          <span className="text-sm font-semibold">{config.depositFeeFlat}</span>
        </div>
        <div className="pt-2">
          <FeeConfigEditDialog config={config} onSave={onSave} />
        </div>
      </CardContent>
    </Card>
  )
}
