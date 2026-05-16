import { OrderBookType } from "@workspace/db"

export type BookOrder = {
  id: string
  userId: string
  marketId: string
  side: "buy" | "sell"
  type: OrderBookType
  price: number
  quantity: number
  filledQty: number
  createdAt: Date
}

export type TradeEvent = {
  makerOrderId: string
  takerOrderId: string
  marketId: string
  price: number
  quantity: number
  side: "buy" | "sell" // taker side
}
