export type TDeposits = {
  id: number
  user_id: number
  asset: string //BTC,ETH,USDT
  amount: number // số coin nạp
  network: string //chọn blockchain nạp
  from_address: string //địa chỉ ví nạp
  tx_hash: string //mã giao dịch
  confirmations: number //số xác nhận
  status: EDepositStatus //trạng thái nạp
  created_at: string //thời gian tạo giao dịch
}
export enum EDepositStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  FAILED = "failed",
}

export type TDepositFilter = {
  status?: EDepositStatus
}
