import { getMarketAssets } from "@/lib/api/markets"
import { useQuery } from "@tanstack/react-query"

export const MARKET_ASSET_LIST_QUERY_KEY = ["market-asset-list"]

export const useMarketAssets = () =>
  useQuery({
    queryKey: MARKET_ASSET_LIST_QUERY_KEY,
    queryFn: getMarketAssets,
    staleTime: 1000 * 60 * 5,
  })
