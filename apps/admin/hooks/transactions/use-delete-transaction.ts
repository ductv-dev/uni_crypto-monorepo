import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { TRANSACTION_LIST_QUERY_KEY } from "./use-transactions"
type TResponseTransaction = {
  message: string
  success: boolean
}

const deleteTransaction = async (id: string): Promise<TResponseTransaction> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    message: `Transaction ${id} Xóa thành công`,
    success: true,
  }
}

export const useDeleteTransaction = (): UseMutationResult<
  TResponseTransaction,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [TRANSACTION_LIST_QUERY_KEY, "delete"],
    mutationFn: deleteTransaction,
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({
        queryKey: [TRANSACTION_LIST_QUERY_KEY],
      })
      toast.success(`Giao dịch ${id} đã được xóa`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
