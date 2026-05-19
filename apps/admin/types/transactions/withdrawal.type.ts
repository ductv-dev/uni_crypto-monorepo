export enum EWithdrawStatus {
  PENDING = "pending",
  APPROVED = "approved",
  COMPLETED = "completed",
  REJECTED = "rejected",
  FAILED = "failed",
}

export type TWithdrawals = {
  id: string | number
  user_id: string | number
  asset_id?: string
  asset: string
  asset_name?: string
  amount: number
  fee: number
  network: string
  to_address: string
  tx_hash: string
  status: EWithdrawStatus | string
  approved_by: string
  note?: string
  rejected_reason?: string
  user_email?: string
  admin_id?: string
  created_at: string
  updated_at?: string
}

export type TWithdrawFilter = {
  status?: EWithdrawStatus | string
}
