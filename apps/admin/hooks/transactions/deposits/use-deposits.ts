import { MOCK_DEPOSITS } from "@/data/transactions/mock-data-deposit"
import { TDepositFilter, TDeposits } from "@/types/transactions/deposits.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
const DEPOSITS_LIST_QUERY_KEY = "deposits-list"

type TDepositResponse = {
  data: TDeposits[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
const getDeposits = async (
  limit: number,
  offset: number,
  search: string,
  filter: TDepositFilter
): Promise<TDepositResponse> => {
  let filteredDeposits = MOCK_DEPOSITS

  if (search) {
    const lowerSearch = search.toLowerCase()

    filteredDeposits = filteredDeposits.filter((deposit) => {
      const matchEmail = String(deposit.user_id)
        .toLowerCase()
        .includes(lowerSearch)
      const matchName = deposit.asset?.toLowerCase().includes(lowerSearch)
      const matchId = String(deposit.network)
        .toLowerCase()
        .includes(lowerSearch)
      const matchPhone = deposit.tx_hash?.toLowerCase().includes(lowerSearch)
      const maychCountry = deposit.status?.toLowerCase().includes(lowerSearch)
      return matchEmail || matchName || matchId || matchPhone || maychCountry
    })
  }

  if (filter.status) {
    filteredDeposits = filteredDeposits.filter(
      (deposit) => deposit.status === filter.status
    )
  }

  const paginatedData = filteredDeposits.slice(offset, offset + limit)

  return Promise.resolve({
    data: paginatedData,
    pagination: {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: filteredDeposits.length,
      totalPages: Math.ceil(filteredDeposits.length / limit),
    },
  })
}

export const useDeposits = (
  limit: number,
  offset: number,
  search: string,
  filter: TDepositFilter
) => {
  return useQuery({
    queryKey: [DEPOSITS_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: () => getDeposits(limit, offset, search, filter),
    staleTime: 1000 * 60 * 5, // 5 phút
    placeholderData: keepPreviousData,
  })
}
