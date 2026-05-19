import { getWithdrawalOverview } from "@/lib/api/deposit-withdrawals"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const WITHDRAWAL_OVERVIEW_QUERY_KEY = ["withdrawal-overview"]

export type TWithdrawalOverview = {
  title: string
  total: number
}

const normalizeWithdrawalOverview = (overview: {
  total: number
  pending: number
  completed: number
  rejected: number
  failed: number
}): TWithdrawalOverview[] => [
  {
    title: "Total Withdrawals",
    total: overview.total,
  },
  {
    title: "Pending Withdrawals",
    total: overview.pending,
  },
  {
    title: "Completed Withdrawals",
    total: overview.completed,
  },
  {
    title: "Rejected Withdrawals",
    total: overview.rejected,
  },
]

export const useWithdrawalOverview = (): UseQueryResult<
  TWithdrawalOverview[],
  Error
> => {
  return useQuery({
    queryKey: WITHDRAWAL_OVERVIEW_QUERY_KEY,
    queryFn: async () =>
      normalizeWithdrawalOverview(await getWithdrawalOverview()),
    staleTime: 1000 * 60 * 5,
  })
}
