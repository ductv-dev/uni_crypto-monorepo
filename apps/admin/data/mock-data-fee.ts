export type TFeeConfig = {
  asset: string
  tradingFeePercent: number
  withdrawFeeFlat: number
  depositFeeFlat: number
  isActive: boolean
}

export type TFeeRecord = {
  id: string
  userId: string
  asset: string
  feeType: "trading" | "withdrawal" | "deposit"
  amount: number
  referenceType: "order" | "withdrawal" | "deposit"
  referenceId: string
  createdAt: string
}

export const FEE_CONFIGS: TFeeConfig[] = [
  {
    asset: "USDT",
    tradingFeePercent: 0.1,
    withdrawFeeFlat: 1,
    depositFeeFlat: 0,
    isActive: true,
  },
  {
    asset: "BTC",
    tradingFeePercent: 0.1,
    withdrawFeeFlat: 0.0005,
    depositFeeFlat: 0,
    isActive: true,
  },
  {
    asset: "ETH",
    tradingFeePercent: 0.12,
    withdrawFeeFlat: 0.0035,
    depositFeeFlat: 0,
    isActive: true,
  },
  {
    asset: "SOL",
    tradingFeePercent: 0.08,
    withdrawFeeFlat: 0.01,
    depositFeeFlat: 0,
    isActive: true,
  },
  {
    asset: "XRP",
    tradingFeePercent: 0.09,
    withdrawFeeFlat: 0.25,
    depositFeeFlat: 0,
    isActive: false,
  },
]

export const FEE_RECORDS: TFeeRecord[] = [
  {
    id: "fee_1",
    userId: "u1",
    asset: "USDT",
    feeType: "trading",
    amount: 2.5,
    referenceType: "order",
    referenceId: "ord_1001",
    createdAt: "2026-04-22T10:00:00Z",
  },
  {
    id: "fee_2",
    userId: "u2",
    asset: "USDT",
    feeType: "withdrawal",
    amount: 1,
    referenceType: "withdrawal",
    referenceId: "wd_2001",
    createdAt: "2026-04-22T10:10:00Z",
  },
  {
    id: "fee_3",
    userId: "u3",
    asset: "BTC",
    feeType: "trading",
    amount: 0.0008,
    referenceType: "order",
    referenceId: "ord_1002",
    createdAt: "2026-04-22T10:30:00Z",
  },
  {
    id: "fee_4",
    userId: "u4",
    asset: "ETH",
    feeType: "withdrawal",
    amount: 0.0035,
    referenceType: "withdrawal",
    referenceId: "wd_2002",
    createdAt: "2026-04-22T11:05:00Z",
  },
  {
    id: "fee_5",
    userId: "u5",
    asset: "ETH",
    feeType: "trading",
    amount: 1.45,
    referenceType: "order",
    referenceId: "ord_1003",
    createdAt: "2026-04-22T11:25:00Z",
  },
  {
    id: "fee_6",
    userId: "u6",
    asset: "SOL",
    feeType: "trading",
    amount: 0.62,
    referenceType: "order",
    referenceId: "ord_1004",
    createdAt: "2026-04-22T12:15:00Z",
  },
  {
    id: "fee_7",
    userId: "u7",
    asset: "USDT",
    feeType: "deposit",
    amount: 0,
    referenceType: "deposit",
    referenceId: "dp_3001",
    createdAt: "2026-04-22T12:45:00Z",
  },
  {
    id: "fee_8",
    userId: "u8",
    asset: "BTC",
    feeType: "withdrawal",
    amount: 0.0005,
    referenceType: "withdrawal",
    referenceId: "wd_2003",
    createdAt: "2026-04-22T13:20:00Z",
  },
  {
    id: "fee_9",
    userId: "u9",
    asset: "SOL",
    feeType: "withdrawal",
    amount: 0.01,
    referenceType: "withdrawal",
    referenceId: "wd_2004",
    createdAt: "2026-04-22T14:00:00Z",
  },
  {
    id: "fee_10",
    userId: "u10",
    asset: "USDT",
    feeType: "trading",
    amount: 4.2,
    referenceType: "order",
    referenceId: "ord_1005",
    createdAt: "2026-04-22T14:30:00Z",
  },
  {
    id: "fee_11",
    userId: "u11",
    asset: "XRP",
    feeType: "trading",
    amount: 0.95,
    referenceType: "order",
    referenceId: "ord_1006",
    createdAt: "2026-04-22T15:00:00Z",
  },
  {
    id: "fee_12",
    userId: "u12",
    asset: "USDT",
    feeType: "withdrawal",
    amount: 1,
    referenceType: "withdrawal",
    referenceId: "wd_2005",
    createdAt: "2026-04-22T15:45:00Z",
  },
  {
    id: "fee_13",
    userId: "u13",
    asset: "ETH",
    feeType: "trading",
    amount: 0.88,
    referenceType: "order",
    referenceId: "ord_0998",
    createdAt: "2026-04-21T16:10:00Z",
  },
  {
    id: "fee_14",
    userId: "u14",
    asset: "BTC",
    feeType: "withdrawal",
    amount: 0.0005,
    referenceType: "withdrawal",
    referenceId: "wd_1997",
    createdAt: "2026-04-21T17:00:00Z",
  },
]
