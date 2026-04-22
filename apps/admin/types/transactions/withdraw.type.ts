export type Withdrawals = {
  id: number
  user_id: number
  asset: string
  amount: number
  fee: number
  network: string
  to_address: string
  tx_hash: string
  status: EWithdrawStatus
  approved_by: string
  created_at: string
}
export enum EWithdrawStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  COMPLETED = "completed",
}
