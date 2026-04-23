"use client"

import { TOrderOverView } from "@/hooks/transactions/orders-book/use-order-book-overview"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  BookmarkCheck,
  BookmarkX,
  ClipboardClock,
  UserPlus,
  Users,
} from "lucide-react"

type Props = {
  overview?: TOrderOverView[]
  isLoading?: boolean
}

const getIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case "filled orders":
      return <BookmarkCheck className="h-4 w-4 text-green-500" />
    case "pending orders":
      return <ClipboardClock className="h-4 w-4 text-yellow-500" />
    case "cancel orders":
      return <BookmarkX className="h-4 w-4 text-red-500" />
    case "partial filled orders":
      return <UserPlus className="h-4 w-4 text-amber-500" />
    default:
      return <Users className="h-4 w-4 text-muted-foreground" />
  }
}

const getColors = (title: string) => {
  switch (title.toLowerCase()) {
    case "filled orders":
      return "bg-green-500/10 text-green-600 dark:text-green-400"
    case "pending orders":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
    case "cancel orders":
      return "bg-red-500/10 text-red-600 dark:text-red-400"
    case "partial filled orders":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
  }
}
export const OverviewOrderOverview: React.FC<Props> = ({
  overview,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-30 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-4">
      {overview?.map((item, index) => {
        return (
          <Card
            key={`${item.title}-${index}`}
            className="flex h-30 justify-center overflow-hidden"
          >
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {item.total.toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-full p-2.5 ${getColors(item.title)}`}>
                  {getIcon(item.title)}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
