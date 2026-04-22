"use client"

import { TDepositFilter } from "@/types/transactions/deposits.type"

export type TDepositPagination = {
  limit: number
  offset: number
}

export const DEFAULT_DEPOSIT_FILTER: TDepositFilter = {
  status: undefined,
}
