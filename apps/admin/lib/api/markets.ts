import { requestJson } from "@/lib/api/client"
import {
  type TCreateMarketPayload,
  type TMarketAsset,
  type TMarket,
  type TMarketFilter,
  type TMarketListResponse,
  type TUpdateMarketPayload,
} from "@/types/market.type"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const buildMarketQuery = (filter: TMarketFilter) => {
  const params = new URLSearchParams()
  params.set("page", String(filter.page ?? DEFAULT_PAGE))
  params.set("limit", String(filter.limit ?? DEFAULT_LIMIT))

  const normalizedSearch = filter.search?.trim()
  if (normalizedSearch) {
    params.set("search", normalizedSearch)
  }

  if (filter.status === "active") {
    params.set("status", "true")
  }

  if (filter.status === "inactive") {
    params.set("status", "false")
  }

  return params.toString()
}

export const getMarkets = (filter: TMarketFilter) =>
  requestJson<TMarketListResponse>(
    `/api/proxy/market?${buildMarketQuery(filter)}`,
    {
      method: "GET",
      defaultErrorMessage: "Failed to fetch markets",
    }
  )

export const getMarketAssets = () =>
  requestJson<TMarketAsset[]>("/api/proxy/market/assets/list", {
    method: "GET",
    defaultErrorMessage: "Failed to fetch assets",
  })

export const createMarket = (payload: TCreateMarketPayload) =>
  requestJson<TMarket>("/api/proxy/market", {
    method: "POST",
    body: JSON.stringify(payload),
    defaultErrorMessage: "Failed to create market",
  })

export const updateMarket = (id: string, payload: TUpdateMarketPayload) =>
  requestJson<TMarket>(`/api/proxy/market/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    defaultErrorMessage: "Failed to update market",
  })

export const deleteMarket = (id: string) =>
  requestJson<{ message: string }>(`/api/proxy/market/${id}`, {
    method: "DELETE",
    defaultErrorMessage: "Failed to delete market",
  })
