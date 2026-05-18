import { updateMarket } from "@/lib/api/markets"
import { type TMarket, type TUpdateMarketPayload } from "@/types/market.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MARKET_LIST_QUERY_KEY } from "./use-markets"

type TUpdateMarketVariables = {
  id: string
  payload: TUpdateMarketPayload
}

export const useUpdateMarket = () => {
  const queryClient = useQueryClient()

  return useMutation<TMarket, Error, TUpdateMarketVariables>({
    mutationFn: ({ id, payload }) => updateMarket(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: MARKET_LIST_QUERY_KEY,
      })
    },
  })
}
