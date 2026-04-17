import { fetchTokens } from "@/lib/data/tokens"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { TToken } from "shared/src/types"

//
const TOKEN_LIST_QUERY_KEY = ["tokens"]

export const useTokens = (): UseQueryResult<TToken[], Error> => {
  return useQuery({
    queryKey: TOKEN_LIST_QUERY_KEY,
    queryFn: fetchTokens,
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút (trước đó là cacheTime)
  })
}

/**
 * Biến thể hook với dữ liệu ban đầu (nếu cần cho SSR hoặc tải nhanh hơn)
 */
export const useTokensWithInitial = (
  initialData: TToken[] | undefined
): UseQueryResult<TToken[], Error> => {
  return useQuery({
    queryKey: TOKEN_LIST_QUERY_KEY,
    queryFn: fetchTokens,
    initialData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
