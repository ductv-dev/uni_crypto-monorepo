import { SYSTEM_WALLETS } from "@/data/mock-data-wallet-crypto"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const WALLET_SYSTEM_OVERVIEW_QUERY_KEY = ["wallet-system-overview"]

type TSystemWallet = (typeof SYSTEM_WALLETS)[number]
type TWalletType = TSystemWallet["type"]

type TTotalWallet = {
  asset: string
  total: number
}

export type TWalletOverView = {
  wallet: TWalletType
  total: TTotalWallet[]
}

const WALLET_ORDER: TWalletType[] = ["hot", "cold", "treasury", "fee"]

export const calculateWalletSystemOverview = (
  wallets: TSystemWallet[]
): TWalletOverView[] => {
  const assets = Array.from(new Set(wallets.map((wallet) => wallet.asset)))

  const overview = WALLET_ORDER.map((walletType) => ({
    wallet: walletType,
    total: assets.map((asset) => ({
      asset,
      total: 0,
    })),
  }))

  wallets.forEach((wallet) => {
    const walletGroup = overview.find((item) => item.wallet === wallet.type)
    const assetGroup = walletGroup?.total.find(
      (item) => item.asset === wallet.asset
    )

    if (assetGroup) {
      assetGroup.total += wallet.balance
    }
  })

  return overview
}

const getWalletSystemOverview = async (): Promise<TWalletOverView[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return calculateWalletSystemOverview(SYSTEM_WALLETS)
}

export const useWalletSystemOverview = (): UseQueryResult<
  TWalletOverView[],
  Error
> => {
  return useQuery({
    queryKey: WALLET_SYSTEM_OVERVIEW_QUERY_KEY,
    queryFn: () => getWalletSystemOverview(),
    staleTime: 1000 * 60 * 5,
  })
}
