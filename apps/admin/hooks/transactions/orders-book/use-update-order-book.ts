import { ORDER_LIST_QUERY_KEY } from "@/hooks/transactions/orders-book/use-order-book"
import { TOrderBook } from "@/types/transactions/orders-book.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

const updateOrderBook = async (order: TOrderBook): Promise<TOrderBook> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return order
}

export const useUpdateOrderBook = (): UseMutationResult<
  TOrderBook,
  Error,
  TOrderBook
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateOrderBook,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ORDER_LIST_QUERY_KEY],
      })
    },
  })
}
