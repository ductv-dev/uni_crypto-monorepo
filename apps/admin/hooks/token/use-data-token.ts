import { LIST_TOKEN } from "@/data/mock-data-list-token"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { TToken } from "@workspace/shared/types"

export const TOKEN_LIST_QUERY_KEY = ["token-list"]

const getTokenList = async (search?: string): Promise<TToken[]> => {
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

  return filteredTokens
}

export const useDataToken = (
  search?: string
): UseQueryResult<TToken[], Error> => {
  return useQuery({
    queryKey: [TOKEN_LIST_QUERY_KEY, search],
    queryFn: () => getTokenList(search),
    initialData: !search ? LIST_TOKEN : undefined,
    staleTime: 1000 * 60 * 5,
  })
}
