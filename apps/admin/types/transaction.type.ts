export enum ETransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  BUY = "BUY",
  SELL = "SELL",
  TRANSFER = "TRANSFER",
}

export enum ETransactionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REJECTED = "REJECTED",
}

export enum ERiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}
export type TTransaction = {
  id: string
  userId: string
  type: ETransactionType
  tokenSymbol: string
  network?: string
  amount: string
  fee: string
  status: ETransactionStatus
  txHash?: string
  fromAddress?: string
  toAddress?: string
  approvedBy?: string
  rejectedBy?: string
  rejectReason?: string
  riskLevel?: ERiskLevel
  createdAt: Date
  updatedAt: Date
}
