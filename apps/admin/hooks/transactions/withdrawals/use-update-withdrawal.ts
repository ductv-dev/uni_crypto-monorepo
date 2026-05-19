import { WITHDRAWAL_OVERVIEW_QUERY_KEY } from "@/hooks/transactions/withdrawals/use-withdrawal-overview"
import { WITHDRAWALS_LIST_QUERY_KEY } from "@/hooks/transactions/withdrawals/use-withdrawals"
import { approveDepositWithdrawal } from "@/lib/api/deposit-withdrawals"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

export type TApproveWithdrawalPayload = {
  id: string
  tx_hash?: string
  note?: string
}

const approveWithdrawal = async (payload: TApproveWithdrawalPayload) =>
  approveDepositWithdrawal(payload.id, {
    tx_hash: payload.tx_hash,
    note: payload.note,
  })

export const useUpdateWithdrawal = (): UseMutationResult<
  unknown,
  Error,
  TApproveWithdrawalPayload
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveWithdrawal,
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
