import { MOCK_TRADES } from "@/data/transactions/mock-data-trade"
import { TTrade, TTradeFilter } from "@/types/transactions/trades.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const TRADES_LIST_QUERY_KEY = "trades-list"

type TTradesResponse = {
  data: TTrade[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const getTrades = async (
  limit: number,
  offset: number,
  search: string,
  filter: TTradeFilter
): Promise<TTradesResponse> => {
  let filteredTrades = MOCK_TRADES

  if (search) {
    const lowerSearch = search.toLowerCase()

    filteredTrades = filteredTrades.filter((trade) => {
      const matchTradeId = trade.id?.toLowerCase().includes(lowerSearch)
      const matchPair = trade.pair?.toLowerCase().includes(lowerSearch)
      const matchBuyOrder = trade.buy_order_id
        ?.toLowerCase()
        .includes(lowerSearch)
      const matchSellOrder = trade.sell_order_id
        ?.toLowerCase()
        .includes(lowerSearch)

      return matchTradeId || matchPair || matchBuyOrder || matchSellOrder
    })
  }

  if (filter.pair) {
    filteredTrades = filteredTrades.filter(
      (trade) => trade.pair === filter.pair
    )
  }

  const paginatedData = filteredTrades.slice(offset, offset + limit)

  return Promise.resolve({
    data: paginatedData,
    pagination: {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: filteredTrades.length,
      totalPages: Math.ceil(filteredTrades.length / limit),
    },
  })
}

export const useTrades = (
  limit: number,
  offset: number,
  search: string,
  filter: TTradeFilter
) => {
  return useQuery({
    queryKey: [TRADES_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: () => getTrades(limit, offset, search, filter),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}
