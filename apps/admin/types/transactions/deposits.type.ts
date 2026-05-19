export enum EDepositStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  FAILED = "failed",
}

export type TDeposits = {
  id: string | number
  user_id: string | number
  asset_id?: string
  asset: string
  asset_name?: string
  amount: number
  fee?: number
  network: string
  from_address: string
  tx_hash: string
  confirmations: number
  status: EDepositStatus | string
  admin_id?: string
  admin_email?: string
  user_email?: string
  note?: string
  rejected_reason?: string
  created_at: string
  updated_at?: string
}

export type TDepositFilter = {
  status?: EDepositStatus | string
}
