import { MOCK_DEPOSITS } from "@/data/transactions/mock-data-deposit"
import { EDepositStatus, TDeposits } from "@/types/transactions/deposits.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const DEPOSIT_OVERVIEW_QUERY_KEY = ["deposit-overview"]

export type TDepositOverView = {
  title: string
  total: number
}

export const calculateOverview = (
  deposits: TDeposits[]
): TDepositOverView[] => {
  const overview: TDepositOverView[] = [
    {
      title: "Total Deposits",
      total: deposits.length,
    },
    {
      title: "Pending Deposits",
      total: deposits.filter((d) => d.status === EDepositStatus.PENDING).length,
    },
    {
      title: "Confirmed Deposits",
      total: deposits.filter((d) => d.status === EDepositStatus.CONFIRMED)
        .length,
    },
    {
      title: "Failed Deposits",
      total: deposits.filter((d) => d.status === EDepositStatus.FAILED).length,
    },
  ]

  return overview
}

const getDepositOverview = async (): Promise<TDepositOverView[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const overview = calculateOverview(MOCK_DEPOSITS)

  return overview
}

export const useDepositOverview = (): UseQueryResult<
  TDepositOverView[],
  Error
> => {
  return useQuery({
    queryKey: [DEPOSIT_OVERVIEW_QUERY_KEY],
    queryFn: () => getDepositOverview(),
    staleTime: 1000 * 60 * 5,
  })
}
