import {
  getWithdrawals,
  type TWithdrawalsResponse,
} from "@/lib/api/deposit-withdrawals"
import { TWithdrawFilter } from "@/types/transactions/withdrawal.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const WITHDRAWALS_LIST_QUERY_KEY = "withdrawals-list"

export const useWithdrawals = (
  limit: number,
  offset: number,
  search: string,
  filter: TWithdrawFilter
) => {
  const page = Math.floor(offset / limit) + 1

  return useQuery<TWithdrawalsResponse>({
    queryKey: [WITHDRAWALS_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: () => getWithdrawals(page, limit, search, filter.status),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}
