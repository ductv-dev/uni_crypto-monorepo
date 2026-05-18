import {
  TFilterOrderBook,
  TOrderBook,
} from "@/types/transactions/order-book.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const ORDER_LIST_QUERY_KEY = "order-list"

type TOrderBookResponse = {
  data: TOrderBook[]
  pagination: {
    limit: number
    offset: number
    total: number
    totalPages: number
  }
}

type RawOrderBookItem = {
  id: string
  user_id: string
  market_id: string
  quantity: number | string
  filled_qty: number | string
  remaining_qty: number | string
  side: TOrderBook["side"]
  type: TOrderBook["type"]
  price: number | string
  status: TOrderBook["status"]
  createdAt: string
  updatedAt: string
  market?: { symbol?: string } & TOrderBook["market"]
  user?: {
    id?: string
    email?: string
  }
}

type RawOrderBookResponse = {
  data: RawOrderBookItem[]
  pagination: TOrderBookResponse["pagination"]
}

const getOrderBook = async (
  limit: number,
  offset: number,
  search: string,
  filter: TFilterOrderBook
): Promise<TOrderBookResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  if (search) params.append("search", search)
  if (filter.status) params.append("status", filter.status)
  if (filter.type) params.append("type", filter.type)
  if (filter.side) params.append("side", filter.side)

  const res = await fetch(`/api/proxy/admin/order-book?${params.toString()}`)

  if (!res.ok) {
    throw new Error("Failed to fetch order book")
  }

  const rawData = (await res.json()) as RawOrderBookResponse

  const mappedData: TOrderBook[] = rawData.data.map((order) => ({
    id: order.id,
    user_id: order.user_id,
    market_id: order.market_id,
    pair: order.market?.symbol || "N/A",
    quantity: Number(order.quantity),
    filled_qty: Number(order.filled_qty),
    remaining_qty: Number(order.remaining_qty),
    side: order.side,
    type: order.type,
    price: Number(order.price),
    amount: Number(order.quantity),
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    market: order.market,
    user: {
      id: order.user?.id || order.user_id,
      email: order.user?.email,
    },
  }))

  return {
    data: mappedData,
    pagination: rawData.pagination,
  }
}

export const useOrderBook = (
  limit: number,
  offset: number,
  search: string,
  filter: TFilterOrderBook
) => {
  return useQuery({
    queryKey: [ORDER_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: () => getOrderBook(limit, offset, search, filter),
    staleTime: 1000 * 60 * 1, // 1 phút
    placeholderData: keepPreviousData,
  })
}
