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

  const res = await fetch(`/api/admin/order-book?${params.toString()}`)

  if (!res.ok) {
    throw new Error("Failed to fetch order book")
  }

  const rawData = await res.json()

  // Map backend data to frontend type
  const mappedData: TOrderBook[] = rawData.data.map((order: any) => ({
    id: order.id,
    user_id: order.user_id,
    pair: order.market?.symbol || "N/A",
    side: order.side,
    type: order.type,
    price: Number(order.price),
    amount: Number(order.quantity),
    status: order.status,
    createdAt: order.createdAt,
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
