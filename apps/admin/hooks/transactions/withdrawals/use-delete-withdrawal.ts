import { WITHDRAWAL_OVERVIEW_QUERY_KEY } from "@/hooks/transactions/withdrawals/use-withdrawal-overview"
import { WITHDRAWALS_LIST_QUERY_KEY } from "@/hooks/transactions/withdrawals/use-withdrawals"
import { rejectDepositWithdrawal } from "@/lib/api/deposit-withdrawals"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

export type TRejectWithdrawalPayload = {
  id: string
  rejected_reason: string
}

const rejectWithdrawal = async (payload: TRejectWithdrawalPayload) =>
  rejectDepositWithdrawal(payload.id, {
    rejected_reason: payload.rejected_reason,
  })

export const useDeleteWithdrawal = (): UseMutationResult<
  unknown,
  Error,
  TRejectWithdrawalPayload
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectWithdrawal,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [WITHDRAWALS_LIST_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: WITHDRAWAL_OVERVIEW_QUERY_KEY,
        }),
      ])
    },
  })
}
