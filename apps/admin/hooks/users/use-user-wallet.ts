import { LIST_USER_WALLET } from "@/data/mock-data-user-wallet"
import { TUserWallet } from "@/types/user.type"
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"
const USE_USER_WALLETS_QUERY_KEY = "use-user-wallets-query-key"

type TUserResponse = {
  data: TUserWallet[]
}
const getUsersWallets = async (userId: string) => {
  let wallets: TUserWallet[] = []
  wallets = LIST_USER_WALLET.filter((wallet) => wallet.userId === userId)
  return Promise.resolve({ data: wallets })
}

export const useUserWallets = (
  id: string
): UseQueryResult<TUserResponse, Error> =>
  useQuery({
    queryKey: [USE_USER_WALLETS_QUERY_KEY, id],
    queryFn: () => getUsersWallets(id),
    staleTime: 1000 * 60 * 5, // 5 phút
    placeholderData: keepPreviousData,
  })
