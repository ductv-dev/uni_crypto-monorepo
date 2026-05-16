export type TOrderBook = {
  id: string
  user_id: string
  market_id: string
  pair: string
  quantity: number
  filled_qty: number
  remaining_qty: number
  side: EOrderSide
  type: EOrderType
  amount: number
  price: number
  status: EOrderStatus
  createdAt: string
  updatedAt: string
  market?: {
    symbol: string
  }
  user?: {
    id?: string
    email?: string
  }
}

export enum EOrderStatus {
  OPEN = "open",
  FILLED = "filled",
  CANCELLED = "cancelled",
  PARTIAL_FILLED = "partial_filled",
}

export enum EOrderSide {
  BUY = "buy",
  SELL = "sell",
}

export enum EOrderType {
  LIMIT = "limit",
  MARKET = "market",
}

export type TFilterOrderBook = {
  status?: EOrderStatus
  side?: EOrderSide
  type?: EOrderType
}
