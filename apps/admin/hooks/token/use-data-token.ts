import { LIST_TOKEN } from "@/data/mock-data-list-token"
import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query"
import { TToken } from "@workspace/shared/types"

export const TOKEN_LIST_QUERY_KEY = ["token-list"]
type TTokenResponse = {
  data: TToken[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const getTokenList = async (
  limit: number,
  offset: number,
  search?: string
): Promise<TTokenResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredTokens = LIST_TOKEN

  if (search) {
    const normalizedSearch = search.trim().toLowerCase()
    filteredTokens = filteredTokens.filter((token) => {
      const name = token.name.toLowerCase()
      const symbol = token.symbol.toLowerCase()
      const address = token.address.toLowerCase()

      return (
        name.includes(normalizedSearch) ||
        symbol.includes(normalizedSearch) ||
        address.includes(normalizedSearch)
      )
    })
  }
  const paginatedData = filteredTokens.slice(offset, offset + limit)

  return Promise.resolve({
    data: paginatedData,
    pagination: {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: filteredTokens.length,
      totalPages: Math.ceil(filteredTokens.length / limit),
    },
  })
}

export const useDataToken = (
  search?: string,
  limit?: number,
  offset?: number
): UseQueryResult<TTokenResponse, Error> => {
  return useQuery({
    queryKey: [TOKEN_LIST_QUERY_KEY, search, limit, offset],
    queryFn: () => getTokenList(limit ?? 10, offset ?? 0, search),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}
