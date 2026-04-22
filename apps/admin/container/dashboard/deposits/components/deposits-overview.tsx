"use client"

import { TDepositOverView } from "@/hooks/transactions/deposits/use-deposit-overview"
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

type TDepositsOverviewProps = {
  overview?: TDepositOverView[]
  isLoading: boolean
}

export const DepositsOverview: React.FC<TDepositsOverviewProps> = ({
  overview,
  isLoading,
}) => {
  const getIcon = (title: string) => {
    switch (title) {
      case "Total Deposits":
        return <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
      case "Pending Deposits":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
      case "Confirmed Deposits":
        return <CheckCircle2Icon className="h-4 w-4 text-green-500" />
      case "Failed Deposits":
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))
        : overview?.map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                {getIcon(item.title)}
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
