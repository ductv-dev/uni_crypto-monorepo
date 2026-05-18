import { getTradeMarkets } from "@/lib/api/markets"
import { createOrder, type CreateOrderPayload } from "@/lib/api/trading"
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query"

const TRADE_MARKETS_QUERY_KEY = ["trade", "markets"]
const USER_WALLETS_QUERY_KEY = ["user", "wallets"]

export const useTradeMarkets = (): UseQueryResult<
  Awaited<ReturnType<typeof getTradeMarkets>>,
  Error
> => {
  return useQuery({
    queryKey: TRADE_MARKETS_QUERY_KEY,
    queryFn: getTradeMarkets,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}

export const useCreateOrder = (): UseMutationResult<
  Awaited<ReturnType<typeof createOrder>>,
  Error,
  CreateOrderPayload
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_WALLETS_QUERY_KEY })
    },
  })
}
