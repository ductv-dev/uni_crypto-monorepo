import { ORDER_LIST_QUERY_KEY } from "@/hooks/transactions/order-book/use-order-book"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

type TDeleteOrderResponse = {
  message: string
  success: boolean
}

const deleteOrder = async (id: number): Promise<TDeleteOrderResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    message: `Order #${id} deleted`,
    success: true,
  }
}

export const useDeleteOrderBook = (): UseMutationResult<
  TDeleteOrderResponse,
  Error,
  number
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ORDER_LIST_QUERY_KEY],
      })
    },
  })
}
