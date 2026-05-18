import { deleteMarket } from "@/lib/api/markets"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MARKET_LIST_QUERY_KEY } from "./use-markets"

export const useDeleteMarket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteMarket(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: MARKET_LIST_QUERY_KEY,
      })
    },
  })
}
