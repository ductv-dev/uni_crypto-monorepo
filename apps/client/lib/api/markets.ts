import { requestJson } from "@/lib/api/client"

type BackendAssetSummary = {
  id: string
  symbol: string
  name: string
  logo_url?: string | null
}

export type BackendTradeMarket = {
  id: string
  symbol: string
  last_price: number | string
  min_order_amount: number | string
  max_order_amount?: number | string | null
  min_order_value: number | string
  price_precision: number
  quantity_precision: number
  baseAsset: BackendAssetSummary
  quoteAsset: BackendAssetSummary
}

export const getTradeMarkets = () =>
  requestJson<BackendTradeMarket[]>("/api/proxy/buy-sell/markets", {
    method: "GET",
    defaultErrorMessage: "Failed to fetch markets",
  })
