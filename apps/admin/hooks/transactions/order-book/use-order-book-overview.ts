import { MOCK_ORDERS } from "@/data/transactions/mock-data-orders"
import { EOrderStatus, TOrderBook } from "@/types/transactions/order-book.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const ORDER_OVERVIEW_QUERY_KEY = ["order-overview"]

export type TOrderOverView = {
  title: string
  total: number
}

export const calculateOverview = (order: TOrderBook[]): TOrderOverView[] => {
  const overview: TOrderOverView[] = [
    {
      title: "Filled Orders",
      total: order.filter((o) => o.status === EOrderStatus.FILLED).length,
    },
    {
      title: "Pending Orders",
      total: order.filter((d) => d.status === EOrderStatus.PENDING).length,
    },
    {
      title: "Cancelled Orders",
      total: order.filter((d) => d.status === EOrderStatus.CANCELED).length,
    },
    {
      title: "Partially Filled",
      total: order.filter((d) => d.status === EOrderStatus.PARTIALLY_FILLED)
        .length,
    },
  ]

  return overview
}

const getOrderOverview = async (): Promise<TOrderOverView[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const overview = calculateOverview(MOCK_ORDERS)

  return overview
}

export const useOrderBookOverview = (): UseQueryResult<
  TOrderOverView[],
  Error
> => {
  return useQuery({
    queryKey: ORDER_OVERVIEW_QUERY_KEY,
    queryFn: () => getOrderOverview(),
    staleTime: 1000 * 60 * 5,
  })
}
