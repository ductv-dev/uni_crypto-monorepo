import { MOCK_WITHDRAWALS } from "@/data/transactions/mock-data-withdraw"
import {
  EWithdrawStatus,
  TWithdrawals,
} from "@/types/transactions/withdrawal.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const WITHDRAWAL_OVERVIEW_QUERY_KEY = ["withdrawal-overview"]

export type TWithdrawalOverview = {
  title: string
  total: number
}

export const calculateOverview = (
  withdrawals: TWithdrawals[]
): TWithdrawalOverview[] => {
  const overview: TWithdrawalOverview[] = [
    {
      title: "Total Withdrawals",
      total: withdrawals.length,
    },
    {
      title: "Pending Withdrawals",
      total: withdrawals.filter((w) => w.status === EWithdrawStatus.PENDING)
        .length,
    },
    {
      title: "Approved Withdrawals",
      total: withdrawals.filter((w) => w.status === EWithdrawStatus.APPROVED)
        .length,
    },
    {
      title: "Rejected Withdrawals",
      total: withdrawals.filter((w) => w.status === EWithdrawStatus.REJECTED)
        .length,
    },
  ]

  return overview
}

const getWithdrawalOverview = async (): Promise<TWithdrawalOverview[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const overview = calculateOverview(MOCK_WITHDRAWALS)

  return overview
}

export const useWithdrawalOverview = (): UseQueryResult<
  TWithdrawalOverview[],
  Error
> => {
  return useQuery({
    queryKey: WITHDRAWAL_OVERVIEW_QUERY_KEY,
    queryFn: () => getWithdrawalOverview(),
    staleTime: 1000 * 60 * 5,
  })
}
