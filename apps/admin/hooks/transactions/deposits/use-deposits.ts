import {
  getDeposits,
  type TDepositResponse,
} from "@/lib/api/deposit-withdrawals"
import { TDepositFilter } from "@/types/transactions/deposits.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const DEPOSITS_LIST_QUERY_KEY = "deposits-list"

export const useDeposits = (
  limit: number,
  offset: number,
  search: string,
  filter: TDepositFilter
) => {
  const page = Math.floor(offset / limit) + 1

  return useQuery<TDepositResponse>({
    queryKey: [DEPOSITS_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: () => getDeposits(page, limit, search, filter.status),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}
