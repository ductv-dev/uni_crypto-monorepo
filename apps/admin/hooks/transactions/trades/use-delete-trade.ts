import { TRADES_LIST_QUERY_KEY } from "@/hooks/transactions/trades/use-trades"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

type TDeleteTradeResponse = {
  message: string
  success: boolean
}

const deleteTrade = async (id: string): Promise<TDeleteTradeResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    message: `Trade ${id} deleted`,
    success: true,
  }
}

export const useDeleteTrade = (): UseMutationResult<
  TDeleteTradeResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTrade,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [TRADES_LIST_QUERY_KEY],
      })
    },
  })
}
