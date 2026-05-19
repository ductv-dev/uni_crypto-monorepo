import { DEPOSIT_OVERVIEW_QUERY_KEY } from "@/hooks/transactions/deposits/use-deposit-overview"
import { DEPOSITS_LIST_QUERY_KEY } from "@/hooks/transactions/deposits/use-deposits"
import { approveDepositWithdrawal } from "@/lib/api/deposit-withdrawals"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

export type TApproveDepositPayload = {
  id: string
  note?: string
}

const approveDeposit = async (payload: TApproveDepositPayload) =>
  approveDepositWithdrawal(payload.id, {
    note: payload.note,
  })

export const useUpdateDeposit = (): UseMutationResult<
  unknown,
  Error,
  TApproveDepositPayload
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveDeposit,
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
