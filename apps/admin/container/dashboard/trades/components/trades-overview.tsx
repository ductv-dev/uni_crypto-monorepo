"use client"

import { TTradeOverview } from "@/hooks/transactions/trades/use-trade-overview"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  ArrowLeftRight,
  ChartCandlestick,
  DollarSign,
  Shapes,
} from "lucide-react"

type TTradesOverviewProps = {
  overview?: TTradeOverview[]
  isLoading: boolean
}
const getIcon = (title: string) => {
  switch (title) {
    case "Total Trades":
      return <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
    case "Unique Pairs":
      return <Shapes className="h-4 w-4 text-blue-500" />
    case "Total Volume":
      return <DollarSign className="h-4 w-4 text-green-500" />
    case "Average Trade Size":
      return <ChartCandlestick className="h-4 w-4 text-orange-500" />
    default:
      return null
  }
}
const getColors = (title: string) => {
  switch (title) {
    case "Total Trades":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    case "Unique Pairs":
      return "bg-green-500/10 text-green-600 dark:text-green-400"
    case "Total Volume":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
    case "Average Trade Size":
      return "bg-red-500/10 text-red-600 dark:text-red-400"
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
  }
}

export const TradesOverview: React.FC<TTradesOverviewProps> = ({
  overview,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[110px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overview?.map((item) => (
        <Card key={item.title} className="h-30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <div className={`${getColors(item.title)} rounded-full p-2.5`}>
              {getIcon(item.title)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {item.total.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
