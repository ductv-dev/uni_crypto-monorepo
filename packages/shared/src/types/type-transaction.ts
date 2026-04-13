export type TTransactionType = "buy" | "sell" | "swap" | "send" | "receive"

export type TTransactionStatus = "pending" | "success" | "failed"

export type TTransaction = {
  id: string
  type: TTransactionType
  status: TTransactionStatus
  fromSymbol: string
  toSymbol?: string // chỉ có khi swap
  fromAmount: number
  toAmount?: number // chỉ có khi swap
  usdtValue: number // giá trị USDT tại thời điểm giao dịch
  fee: number // phí giao dịch (USDT)
  walletAddress: string
  createdAt: string // ISO date string
  txHash: string // transaction hash (mô phỏng)
}
