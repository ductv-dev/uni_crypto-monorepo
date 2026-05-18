import { createMarket } from "@/lib/api/markets"
import { type TCreateMarketPayload, type TMarket } from "@/types/market.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MARKET_LIST_QUERY_KEY } from "./use-markets"

export const useCreateMarket = () => {
  const queryClient = useQueryClient()

  return useMutation<TMarket, Error, TCreateMarketPayload>({
    mutationFn: createMarket,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: MARKET_LIST_QUERY_KEY,
      })
    },
  })
}
