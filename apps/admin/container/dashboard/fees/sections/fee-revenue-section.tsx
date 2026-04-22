import { TFeeRevenueOverview } from "@/hooks/settings/use-fee-revenue-overview"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { RevenueBreakdownCard } from "../components/revenue-breakdown-card"

type Props = {
  data?: TFeeRevenueOverview
  isLoading: boolean
}

export const FeeRevenueSection: React.FC<Props> = ({ data, isLoading }) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Fee Revenue</h2>
        <p className="text-sm text-muted-foreground">
          Breakdown for today by asset and fee type.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-[230px] w-full" />
            <Skeleton className="h-[230px] w-full" />
          </>
        ) : (
          <>
            <RevenueBreakdownCard
              title="Revenue by Asset"
              data={data?.byAsset ?? []}
            />
            <RevenueBreakdownCard
              title="Revenue by Fee Type"
              data={data?.byFeeType ?? []}
            />
          </>
        )}
      </div>
    </section>
  )
}
