export type TMarketAsset = {
  id: string
  name: string
  symbol: string
  status?: boolean
}

export type TMarket = {
  id: string
  symbol: string
  base_asset_id: string
  quote_asset_id: string
  min_order_amount: number | string
  max_order_amount?: number | string | null
  min_order_value: number | string
  price_precision: number
  quantity_precision: number
  description?: string | null
  status: boolean
  createdAt: string
  updatedAt: string
  baseAsset?: TMarketAsset
  quoteAsset?: TMarketAsset
}

export type TMarketListMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type TMarketListResponse = {
  data: TMarket[]
  meta: TMarketListMeta
}

export type TMarketFilter = {
  search?: string
  status?: "all" | "active" | "inactive"
  page?: number
  limit?: number
}

export type TCreateMarketPayload = {
  symbol: string
  base_asset_id: string
  quote_asset_id: string
  min_order_amount: number
  max_order_amount?: number
  min_order_value?: number
  price_precision?: number
  quantity_precision?: number
  description?: string
  status?: boolean
}

export type TUpdateMarketPayload = {
  min_order_amount?: number
  max_order_amount?: number
  min_order_value?: number
  price_precision?: number
  quantity_precision?: number
  description?: string
  status?: boolean
}
