import { requestJson } from "@/lib/api/client"

export type BackendWalletAsset = {
  id: string
  name: string
  symbol: string
  description?: string | null
  logo_url?: string | null
  status?: boolean
  createdAt?: string
  updatedAt?: string
}

export type BackendWallet = {
  id: string
  user_id: string
  asset_id: string
  available_balance: number | string
  blocked_balance: number | string
  status: boolean
  createdAt: string
  updatedAt: string
  asset: BackendWalletAsset | null
}

export const getUserWallets = () =>
  requestJson<BackendWallet[]>("/api/user/wallets", {
    method: "GET",
    defaultErrorMessage: "Failed to fetch wallets",
  })
