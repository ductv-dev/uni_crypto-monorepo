import {
  fetchWalletMethods,
  type MethodAddWalletType,
} from "@/lib/data/wallet-methods"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

const WALLET_METHODS_QUERY_KEY = ["wallet", "methods"]

export const useWalletMethods = (): UseQueryResult<
  MethodAddWalletType[],
  Error
> => {
  return useQuery({
    queryKey: WALLET_METHODS_QUERY_KEY,
    queryFn: fetchWalletMethods,
    staleTime: 1000 * 60 * 60, // 1 giờ - phương thức ít khi thay đổi
    gcTime: 1000 * 60 * 120, // 2 giờ
  })
}
