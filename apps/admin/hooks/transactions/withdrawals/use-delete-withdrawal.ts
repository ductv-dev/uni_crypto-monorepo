import { WITHDRAWALS_LIST_QUERY_KEY } from "@/hooks/transactions/withdrawals/use-withdrawals"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

type TDeleteWithdrawalResponse = {
  message: string
  success: boolean
}

const deleteWithdrawal = async (
  id: number
): Promise<TDeleteWithdrawalResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    message: `Withdrawal #${id} deleted`,
    success: true,
  }
}

export const useDeleteWithdrawal = (): UseMutationResult<
  TDeleteWithdrawalResponse,
  Error,
  number
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWithdrawal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [WITHDRAWALS_LIST_QUERY_KEY],
      })
    },
  })
}
