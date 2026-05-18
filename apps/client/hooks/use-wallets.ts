import { getUserWallets, type BackendWallet } from "@/lib/api/wallets"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

const USER_WALLETS_QUERY_KEY = ["user", "wallets"]

export const useWallets = (): UseQueryResult<BackendWallet[], Error> => {
  return useQuery({
    queryKey: USER_WALLETS_QUERY_KEY,
    queryFn: getUserWallets,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })
}
