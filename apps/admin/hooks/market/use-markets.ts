import { getMarkets } from "@/lib/api/markets"
import { type TMarketFilter } from "@/types/market.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const MARKET_LIST_QUERY_KEY = ["market-list"]

export const useMarkets = (filter: TMarketFilter) =>
  useQuery({
    queryKey: [...MARKET_LIST_QUERY_KEY, filter],
    queryFn: () => getMarkets(filter),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  })
