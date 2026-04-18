import { LIST_TOKEN } from "@/data/mock-data-list-token"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { TToken } from "@workspace/shared/types"

const TOKEN_LIST_QUERY_KEY = ["token-list"]

const getTokenList = async (): Promise<TToken[]> => {
  return Promise.resolve(LIST_TOKEN)
}

export const useDataToken = (): UseQueryResult<TToken[], Error> => {
  return useQuery({
    queryKey: TOKEN_LIST_QUERY_KEY,
    queryFn: getTokenList,
    initialData: LIST_TOKEN,
    staleTime: Infinity,
  })
}
