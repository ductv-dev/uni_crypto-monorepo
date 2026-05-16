import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const ORDER_OVERVIEW_QUERY_KEY = ["order-overview"]

export type TOrderOverView = {
  title: string
  total: number
}

const getOrderOverview = async (): Promise<TOrderOverView[]> => {
  const res = await fetch("/api/admin/order-book/overview")
  if (!res.ok) throw new Error("Failed to fetch order overview")

  const data = await res.json()

  return [
    {
      title: "Total Orders",
      total: data.totalOrders,
    },
    {
      title: "Open Orders",
      total: data.openOrders,
    },
    {
      title: "Filled Orders",
      total: data.filledOrders,
    },
    {
      title: "Cancelled Orders",
      total: data.cancelledOrders,
    },
  ]
}

export const useOrderBookOverview = (): UseQueryResult<
  TOrderOverView[],
  Error
> => {
  return useQuery({
    queryKey: ORDER_OVERVIEW_QUERY_KEY,
    queryFn: getOrderOverview,
    staleTime: 1000 * 60 * 5,
  })
}
