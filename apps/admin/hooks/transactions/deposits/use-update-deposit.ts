import { DEPOSITS_LIST_QUERY_KEY } from "@/hooks/transactions/deposits/use-deposits"
import { TDeposits } from "@/types/transactions/deposits.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

const updateDeposit = async (deposit: TDeposits): Promise<TDeposits> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return deposit
}

export const useUpdateDeposit = (): UseMutationResult<
  TDeposits,
  Error,
  TDeposits
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateDeposit,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DEPOSITS_LIST_QUERY_KEY],
      })
    },
  })
}
