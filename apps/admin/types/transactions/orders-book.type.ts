export type TOrderBook = {
  id: number
  user_id: number
  pair: string
  type: EOrderType
  side: EOrderSide
  amount: number
  price: number
  status: EOrderStatus
  created_at: string
  updated_at: string
}

export enum EOrderStatus {
  PENDING = "pending",
  FILLED = "filled",
  CANCELED = "canceled",
  PARTIALLY_FILLED = "partially_filled",
}

export enum EOrderType {
  BUY = "buy",
  SELL = "sell",
}

export enum EOrderSide {
  LIMIT = "limit",
  MARKET = "market",
}
export type TFilterOrderBook = {
  status?: EOrderStatus
  type?: EOrderType
  side?: EOrderSide
}
