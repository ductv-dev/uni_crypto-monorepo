import { requestJson } from "@/lib/api/client"

export type CreateOrderPayload = {
  market_id: string
  type: "limit" | "market"
  side: "buy" | "sell"
  price: number
  quantity: number
}

export type BackendOrder = {
  id: string
  user_id: string
  market_id: string
  type: "limit" | "market"
  side: "buy" | "sell"
  price?: number | string | null
  quantity: number | string
  filled_qty: number | string
  remaining_qty: number | string
  status: string
  createdAt: string
  updatedAt: string
}

export const createOrder = (payload: CreateOrderPayload) =>
  requestJson<BackendOrder>("/api/proxy/buy-sell", {
    method: "POST",
    body: JSON.stringify(payload),
    defaultErrorMessage: "Failed to place order",
  })
