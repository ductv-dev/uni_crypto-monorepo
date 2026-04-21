import { LIST_USER } from "@/data/mock-data-user"
import { TUser } from "@/types/user.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const USER_OVERVIEW_QUERY_KEY = ["user-overview"]

export type TUserOverView = {
  title: string
  total: number
}

export const calculateOverview = (users: TUser[]): TUserOverView[] => {
  const overview: TUserOverView[] = [
    {
      title: "Total users",
      total: users.length,
    },
    {
      title: "Pending users",
      total: users.filter((user) => user.status === "pending").length,
    },
    {
      title: "Inactive users",
      total: users.filter((user) => user.status === "inactive").length,
    },
    {
      title: "Active users",
      total: users.filter((user) => user.status === "active").length,
    },
  ]

  return overview
}

const getUserOverview = async (): Promise<TUserOverView[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const overview = calculateOverview(LIST_USER)

  return overview
}

export const useUserOverview = (): UseQueryResult<TUserOverView[], Error> => {
  return useQuery({
    queryKey: [USER_OVERVIEW_QUERY_KEY],
    queryFn: () => getUserOverview(),
    staleTime: 1000 * 60 * 5,
  })
}
