import {
  requestWalletDeposit,
  requestWalletWithdraw,
  type RequestDepositPayload,
  type RequestWithdrawPayload,
} from "@/lib/api/wallet-transfers"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"

const USER_WALLETS_QUERY_KEY = ["user", "wallets"]

type DepositVariables = {
  walletId: string
  payload: RequestDepositPayload
}

type WithdrawVariables = {
  walletId: string
  payload: RequestWithdrawPayload
}

export const useRequestDeposit = (): UseMutationResult<
  Awaited<ReturnType<typeof requestWalletDeposit>>,
  Error,
  DepositVariables
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ walletId, payload }) =>
      requestWalletDeposit(walletId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_WALLETS_QUERY_KEY })
    },
  })
}

export const useRequestWithdraw = (): UseMutationResult<
  Awaited<ReturnType<typeof requestWalletWithdraw>>,
  Error,
  WithdrawVariables
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ walletId, payload }) =>
      requestWalletWithdraw(walletId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USER_WALLETS_QUERY_KEY })
    },
  })
}
