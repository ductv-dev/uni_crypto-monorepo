import { MOCK_TRADES } from "@/data/transactions/mock-data-trade"
import { Trade } from "@/types/transactions/trades.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const TRADE_OVERVIEW_QUERY_KEY = ["trade-overview"]

export type TTradeOverview = {
  title: string
  total: number
}

export const calculateOverview = (trades: Trade[]): TTradeOverview[] => {
  const totalVolume = trades.reduce((sum, trade) => sum + trade.total, 0)
  const uniquePairs = new Set(trades.map((trade) => trade.pair)).size

  const overview: TTradeOverview[] = [
    {
      title: "Total Trades",
      total: trades.length,
    },
    {
      title: "Unique Pairs",
      total: uniquePairs,
    },
    {
      title: "Total Volume",
      total: Number(totalVolume.toFixed(2)),
    },
    {
      title: "Average Trade Size",
      total: trades.length
        ? Number((totalVolume / trades.length).toFixed(2))
        : 0,
    },
  ]

  return overview
}

const getTradeOverview = async (): Promise<TTradeOverview[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const overview = calculateOverview(MOCK_TRADES)

  return overview
}

export const useTradeOverview = (): UseQueryResult<TTradeOverview[], Error> => {
  return useQuery({
    queryKey: TRADE_OVERVIEW_QUERY_KEY,
    queryFn: () => getTradeOverview(),
    staleTime: 1000 * 60 * 5,
  })
}
