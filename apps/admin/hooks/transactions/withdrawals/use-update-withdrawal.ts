import { WITHDRAWALS_LIST_QUERY_KEY } from "@/hooks/transactions/withdrawals/use-withdrawals"
import { Withdrawals } from "@/types/transactions/withdraw.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

const updateWithdrawal = async (
  withdrawal: Withdrawals
): Promise<Withdrawals> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return withdrawal
}

export const useUpdateWithdrawal = (): UseMutationResult<
  Withdrawals,
  Error,
  Withdrawals
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
