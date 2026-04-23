import { TRADES_LIST_QUERY_KEY } from "@/hooks/transactions/trades/use-trades"
import { Trade } from "@/types/transactions/trades.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

const updateTrade = async (trade: Trade): Promise<Trade> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return trade
}

export const useUpdateTrade = (): UseMutationResult<Trade, Error, Trade> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTrade,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [TRADES_LIST_QUERY_KEY],
      })
    },
  })
}
