import { DEPOSIT_OVERVIEW_QUERY_KEY } from "@/hooks/transactions/deposits/use-deposit-overview"
import { DEPOSITS_LIST_QUERY_KEY } from "@/hooks/transactions/deposits/use-deposits"
import { rejectDepositWithdrawal } from "@/lib/api/deposit-withdrawals"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

export type TRejectDepositPayload = {
  id: string
  rejected_reason: string
}

const rejectDeposit = async (payload: TRejectDepositPayload) =>
  rejectDepositWithdrawal(payload.id, {
    rejected_reason: payload.rejected_reason,
  })

export const useDeleteDeposit = (): UseMutationResult<
  unknown,
  Error,
  TRejectDepositPayload
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectDeposit,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [DEPOSITS_LIST_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: DEPOSIT_OVERVIEW_QUERY_KEY,
        }),
      ])
    },
  })
}
