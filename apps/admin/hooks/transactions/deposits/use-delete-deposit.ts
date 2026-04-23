import { DEPOSITS_LIST_QUERY_KEY } from "@/hooks/transactions/deposits/use-deposits"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

type TDeleteDepositResponse = {
  message: string
  success: boolean
}

const deleteDeposit = async (id: number): Promise<TDeleteDepositResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    message: `Deposit #${id} deleted`,
    success: true,
  }
}

export const useDeleteDeposit = (): UseMutationResult<
  TDeleteDepositResponse,
  Error,
  number
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDeposit,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DEPOSITS_LIST_QUERY_KEY],
      })
    },
  })
}
