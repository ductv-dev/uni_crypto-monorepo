import { LIST_TOKEN } from "@/data/mock-data-list-token"
import { TOKEN_LIST_QUERY_KEY } from "@/hooks/use-data-token"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { TokenCreateSchemaType } from "@workspace/shared/schemas"
import { TToken } from "@workspace/shared/types"

const createToken = async (payload: TokenCreateSchemaType): Promise<TToken> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newToken: TToken = {
    name: payload.name,
    symbol: payload.symbol,
    address: payload.address,
    decimals: payload.decimals,
    logoURI:
      payload.logoURI || "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    usdt: 0,
    isTradingEnabled: true,
    isWithdrawEnabled: true,
    isDepositEnabled: true,
    number_changes: 0,
  }

  LIST_TOKEN.push(newToken)

  return newToken
}

export const useCreateToken = (): UseMutationResult<
  TToken,
  Error,
  TokenCreateSchemaType
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [TOKEN_LIST_QUERY_KEY, "create"],
    mutationFn: createToken,
    onSuccess: () => async () => {
      await queryClient.invalidateQueries({
        queryKey: TOKEN_LIST_QUERY_KEY,
      })
    },
  })
}
