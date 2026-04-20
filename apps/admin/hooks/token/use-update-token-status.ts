import { LIST_TOKEN } from "@/data/mock-data-list-token"
import { TOKEN_LIST_QUERY_KEY } from "@/hooks/token/use-data-token"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { TToken } from "@workspace/shared/types"

type TTokenStatusKey =
  | "isDepositEnabled"
  | "isWithdrawEnabled"
  | "isTradingEnabled"

type TUpdateTokenStatusPayload = {
  address: string
  key: TTokenStatusKey
  value: boolean
}

const updateTokenStatus = async ({
  address,
  key,
  value,
}: TUpdateTokenStatusPayload): Promise<TToken> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const token = LIST_TOKEN.find((item) => item.address === address)

  if (!token) {
    throw new Error("Token not found")
  }

  token[key] = value

  return {
    ...token,
    [key]: value,
  }
}

export const useUpdateTokenStatus = (): UseMutationResult<
  TToken,
  Error,
  TUpdateTokenStatusPayload
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...TOKEN_LIST_QUERY_KEY, "update-status"],
    mutationFn: updateTokenStatus,
    onSuccess: () => async () => {
      await queryClient.invalidateQueries({
        queryKey: TOKEN_LIST_QUERY_KEY,
      })
    },
  })
}
