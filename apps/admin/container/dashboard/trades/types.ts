"use client"

import { TTradeFilter } from "@/types/transactions/trades.type"

export type TTradePagination = {
  limit: number
  offset: number
}

export const DEFAULT_TRADE_FILTER: TTradeFilter = {
  pair: undefined,
}
