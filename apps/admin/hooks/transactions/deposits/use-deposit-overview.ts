import { getDepositOverview } from "@/lib/api/deposit-withdrawals"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const DEPOSIT_OVERVIEW_QUERY_KEY = ["deposit-overview"]

export type TDepositOverView = {
  title: string
  total: number
}

const normalizeDepositOverview = (overview: {
  total: number
  pending: number
  completed: number
  rejected: number
  failed: number
}): TDepositOverView[] => [
  {
    title: "Total Deposits",
    total: overview.total,
  },
  {
    title: "Pending Deposits",
    total: overview.pending,
  },
  {
    title: "Completed Deposits",
    total: overview.completed,
  },
  {
    title: "Rejected Deposits",
    total: overview.rejected,
  },
]

export const useDepositOverview = (): UseQueryResult<
  TDepositOverView[],
  Error
> => {
  return useQuery({
    queryKey: DEPOSIT_OVERVIEW_QUERY_KEY,
    queryFn: async () => normalizeDepositOverview(await getDepositOverview()),
    staleTime: 1000 * 60 * 5,
  })
}
