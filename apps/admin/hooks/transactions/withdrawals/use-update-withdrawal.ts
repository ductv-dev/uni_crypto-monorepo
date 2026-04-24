import { WITHDRAWALS_LIST_QUERY_KEY } from "@/hooks/transactions/withdrawals/use-withdrawals"
import { TWithdrawals } from "@/types/transactions/withdrawal.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

const updateWithdrawal = async (
  withdrawal: TWithdrawals
): Promise<TWithdrawals> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return withdrawal
}

export const useUpdateWithdrawal = (): UseMutationResult<
  TWithdrawals,
  Error,
  TWithdrawals
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateWithdrawal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [WITHDRAWALS_LIST_QUERY_KEY],
      })
    },
  })
}
