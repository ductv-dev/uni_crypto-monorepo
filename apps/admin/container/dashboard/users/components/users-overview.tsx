"use client"

import { TUserOverView } from "@/hooks/users/use-user-overview"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { UserCheck, UserMinus, UserPlus, Users, UserX } from "lucide-react"

type Props = {
  overview?: TUserOverView[]
  isLoading?: boolean
}

const getIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case "total users":
      return <Users className="h-4 w-4 text-blue-500" />
    case "blocked users":
      return <UserX className="h-4 w-4 text-red-500" />
    case "inactive users":
      return <UserMinus className="h-4 w-4 text-orange-500" />
    case "active users":
      return <UserCheck className="h-4 w-4 text-green-500" />
    case "pending users":
      return <UserPlus className="h-4 w-4 text-amber-500" />
    default:
      return <Users className="h-4 w-4 text-muted-foreground" />
  }
}

const getColors = (title: string) => {
  switch (title.toLowerCase()) {
    case "total users":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    case "blocked users":
      return "bg-red-500/10 text-red-600 dark:text-red-400"
    case "inactive users":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
    case "active users":
      return "bg-green-500/10 text-green-600 dark:text-green-400"
    case "pending users":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
  }
}

export const UsersOverview: React.FC<Props> = ({
  overview,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-30 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overview?.map((item, index) => (
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
      ))}
    </div>
  )
}
