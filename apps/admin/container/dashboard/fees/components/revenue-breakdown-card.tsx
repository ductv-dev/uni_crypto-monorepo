import { TFeeRevenueOverview } from "@/hooks/settings/use-fee-revenue-overview"
import { formatAmount } from "@/lib/utils/fees"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type Props = {
  title: string
  data: TFeeRevenueOverview["byAsset"] | TFeeRevenueOverview["byFeeType"]
}

export const RevenueBreakdownCard: React.FC<Props> = ({ title, data }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length ? (
          data.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
            >
              <span className="text-sm font-medium capitalize">
                {item.label}
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {formatAmount(item.total)}
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
            No fee revenue data available.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
