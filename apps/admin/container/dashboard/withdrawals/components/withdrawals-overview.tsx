"use client"

import { TWithdrawalOverview } from "@/hooks/transactions/withdrawals/use-withdrawal-overview"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  CheckCircle2Icon,
  ClockIcon,
  HelpCircleIcon,
  XCircleIcon,
} from "lucide-react"

type TWithdrawalsOverviewProps = {
  overview?: TWithdrawalOverview[]
  isLoading: boolean
}

export const WithdrawalsOverview: React.FC<TWithdrawalsOverviewProps> = ({
  overview,
  isLoading,
}) => {
  const getIcon = (title: string) => {
    switch (title) {
      case "Total Withdrawals":
        return <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
      case "Pending Withdrawals":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
      case "Approved Withdrawals":
        return <CheckCircle2Icon className="h-4 w-4 text-green-500" />
      case "Rejected Withdrawals":
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }
  const getColors = (title: string) => {
    switch (title) {
      case "Total Withdrawals":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      case "Pending Withdrawals":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      case "Approved Withdrawals":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "Rejected Withdrawals":
        return "bg-red-500/10 text-red-600 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
    }
  }
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-30">
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
