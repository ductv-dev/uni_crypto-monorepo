import { requestJson } from "@/lib/api/client"

export type RequestDepositPayload = {
  amount: number
  network: string
  tx_hash: string
  from_address: string
}

export type RequestWithdrawPayload = {
  amount: number
  network: string
  to_address: string
}

export type BackendTransferRequest = {
  id: string
  user_id: string
  asset_id: string
  type: "deposit" | "withdraw"
  amount: number | string
  network: string
  tx_hash?: string | null
  from_address?: string | null
  to_address?: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export const requestWalletDeposit = (
  walletId: string,
  payload: RequestDepositPayload
) =>
  requestJson<BackendTransferRequest>(
    `/api/proxy/my-wallet/${walletId}/deposit`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      defaultErrorMessage: "Failed to request deposit",
    }
  )

export const requestWalletWithdraw = (
  walletId: string,
  payload: RequestWithdrawPayload
) =>
  requestJson<BackendTransferRequest>(
    `/api/proxy/my-wallet/${walletId}/withdraw`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      defaultErrorMessage: "Failed to request withdrawal",
    }
  )
