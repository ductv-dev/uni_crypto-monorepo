import { requestJson } from "@/lib/api/client"

export type BackendHistoryAsset = {
  id: string
  symbol: string
  name: string
}

export type BackendHistoryWallet = {
  id: string
  asset: BackendHistoryAsset | null
}

export type BackendHistoryItem = {
  id: string
  wallet_id: string
  type: string
  direction: string
  amount: string
  balance_before: string
  balance_after: string
  reference_type?: string | null
  reference_id?: string | null
  status: string
  description?: string | null
  createdAt: string
  wallet: BackendHistoryWallet
}

export type BackendHistoryResponse = {
  data: BackendHistoryItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const getUserHistory = (page = 1, limit = 20) =>
  requestJson<BackendHistoryResponse>(
    `/api/user/history?page=${page}&limit=${limit}`,
    {
      method: "GET",
      defaultErrorMessage: "Failed to fetch history",
    }
  )
