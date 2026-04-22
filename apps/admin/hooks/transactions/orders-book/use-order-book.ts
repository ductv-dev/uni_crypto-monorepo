import { MOCK_ORDERS } from "@/data/transactions/mock-data-orders"
import {
  TFilterOrderBook,
  TOrderBook,
} from "@/types/transactions/orders-book.type"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
const ORDER_LIST_QUERY_KEY = "order-list"

type TOrderBookResponse = {
  data: TOrderBook[]
  pagination: {
    page: number
    limit: number
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
  let filterOrderBook = MOCK_ORDERS

  if (search) {
    const lowerSearch = search.toLowerCase()

    filterOrderBook = filterOrderBook.filter((order) => {
      const matchEmail = String(order.user_id)
        .toLowerCase()
        .includes(lowerSearch)
      const matchName = order.pair?.toLowerCase().includes(lowerSearch)
      const matchId = String(order.side).toLowerCase().includes(lowerSearch)
      const matchPhone = order.type?.toLowerCase().includes(lowerSearch)
      const maychCountry = order.status?.toLowerCase().includes(lowerSearch)
      return matchEmail || matchName || matchId || matchPhone || maychCountry
    })
  }

  if (filter.status) {
    filterOrderBook = filterOrderBook.filter(
      (order) => order.status === filter.status
    )
  }

  const paginatedData = filterOrderBook.slice(offset, offset + limit)

  return Promise.resolve({
    data: paginatedData,
    pagination: {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: filterOrderBook.length,
      totalPages: Math.ceil(filterOrderBook.length / limit),
    },
  })
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
    staleTime: 1000 * 60 * 5, // 5 phút
    placeholderData: keepPreviousData,
  })
}
