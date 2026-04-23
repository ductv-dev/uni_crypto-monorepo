import { MOCK_WITHDRAWALS } from "@/data/transactions/mock-data-withdraw"
import {
  TWithdrawFilter,
  TWithdrawals,
} from "@/types/transactions/withdraw.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const WITHDRAWALS_LIST_QUERY_KEY = "withdrawals-list"

type TWithdrawalsResponse = {
  data: TWithdrawals[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const getWithdrawals = async (
  limit: number,
  offset: number,
  search: string,
  filter: TWithdrawFilter
): Promise<TWithdrawalsResponse> => {
  let filteredWithdrawals = MOCK_WITHDRAWALS

  if (search) {
    const lowerSearch = search.toLowerCase()

    filteredWithdrawals = filteredWithdrawals.filter((withdrawal) => {
      const matchUserId = String(withdrawal.user_id)
        .toLowerCase()
        .includes(lowerSearch)
      const matchAsset = withdrawal.asset?.toLowerCase().includes(lowerSearch)
      const matchNetwork = withdrawal.network
        ?.toLowerCase()
        .includes(lowerSearch)
      const matchTxHash = withdrawal.tx_hash
        ?.toLowerCase()
        .includes(lowerSearch)
      const matchAddress = withdrawal.to_address
        ?.toLowerCase()
        .includes(lowerSearch)

      return (
        matchUserId || matchAsset || matchNetwork || matchTxHash || matchAddress
      )
    })
  }

  if (filter.status) {
    filteredWithdrawals = filteredWithdrawals.filter(
      (withdrawal) => withdrawal.status === filter.status
    )
  }

  const paginatedData = filteredWithdrawals.slice(offset, offset + limit)

  return Promise.resolve({
    data: paginatedData,
    pagination: {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: filteredWithdrawals.length,
      totalPages: Math.ceil(filteredWithdrawals.length / limit),
    },
  })
}

export const useWithdrawals = (
  limit: number,
  offset: number,
  search: string,
  filter: TWithdrawFilter
) => {
  return useQuery({
    queryKey: [WITHDRAWALS_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: () => getWithdrawals(limit, offset, search, filter),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}
