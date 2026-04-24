"use client"

import { TWithdrawFilter } from "@/types/transactions/withdrawal.type"

export type TWithdrawalPagination = {
  limit: number
  offset: number
}

export const DEFAULT_WITHDRAWAL_FILTER: TWithdrawFilter = {
  status: undefined,
}
