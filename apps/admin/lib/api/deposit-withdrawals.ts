import { requestJson } from "@/lib/api/client"
import {
  EDepositStatus,
  type TDeposits,
} from "@/types/transactions/deposits.type"
import {
  EWithdrawStatus,
  type TWithdrawals,
} from "@/types/transactions/withdrawal.type"

type BackendDepositWithdrawalRow = {
  id: string
  user_id: string
  asset_id: string
  type: "deposit" | "withdraw"
  amount: number | string
  fee?: number | string | null
  network?: string | null
  tx_hash?: string | null
  from_address?: string | null
  to_address?: string | null
  confirmations?: number | null
  admin_id?: string | null
  status: string
  note?: string | null
  rejected_reason?: string | null
  createdAt: string
  updatedAt: string
  user?: { id: string; email: string } | null
  asset?: { id: string; name: string; symbol: string } | null
  admin?: { id: string; email: string } | null
}

type BackendDepositWithdrawalListResponse = {
  data: BackendDepositWithdrawalRow[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type TDepositResponse = {
  data: TDeposits[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TWithdrawalsResponse = {
  data: TWithdrawals[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type TDepositOverviewResponse = {
  total: number
  pending: number
  completed: number
  rejected: number
  failed: number
}

export type TWithdrawalOverviewResponse = TDepositOverviewResponse

type TListOptions = {
  page: number
  limit: number
  search?: string
  status?: string
}

type TApproveRequestPayload = {
  note?: string
  tx_hash?: string
}

type TRejectRequestPayload = {
  rejected_reason: string
}

const buildListQuery = (
  options: TListOptions,
  type: "deposit" | "withdraw"
) => {
  const params = new URLSearchParams()
  params.set("page", String(options.page))
  params.set("limit", String(options.limit))
  params.set("type", type)

  const normalizedSearch = options.search?.trim()
  if (normalizedSearch) {
    params.set("search", normalizedSearch)
  }

  const normalizedStatus = options.status?.trim()
  if (normalizedStatus) {
    params.set("status", normalizedStatus)
  }

  return params.toString()
}

const mapDeposit = (row: BackendDepositWithdrawalRow): TDeposits => ({
  id: row.id,
  user_id: row.user_id,
  asset_id: row.asset_id,
  asset: row.asset?.symbol ?? row.asset_id,
  asset_name: row.asset?.name ?? undefined,
  amount: Number(row.amount),
  fee: Number(row.fee ?? 0),
  network: row.network ?? "",
  from_address: row.from_address ?? "",
  tx_hash: row.tx_hash ?? "",
  confirmations: row.confirmations ?? 0,
  status: row.status as EDepositStatus,
  admin_id: row.admin_id ?? undefined,
  admin_email: row.admin?.email ?? undefined,
  user_email: row.user?.email ?? undefined,
  note: row.note ?? undefined,
  rejected_reason: row.rejected_reason ?? undefined,
  created_at: row.createdAt,
  updated_at: row.updatedAt,
})

const mapWithdrawal = (row: BackendDepositWithdrawalRow): TWithdrawals => ({
  id: row.id,
  user_id: row.user_id,
  asset_id: row.asset_id,
  asset: row.asset?.symbol ?? row.asset_id,
  asset_name: row.asset?.name ?? undefined,
  amount: Number(row.amount),
  fee: Number(row.fee ?? 0),
  network: row.network ?? "",
  to_address: row.to_address ?? "",
  tx_hash: row.tx_hash ?? "",
  status: row.status as EWithdrawStatus,
  approved_by: row.admin?.email ?? "",
  note: row.note ?? undefined,
  rejected_reason: row.rejected_reason ?? undefined,
  user_email: row.user?.email ?? undefined,
  admin_id: row.admin_id ?? undefined,
  created_at: row.createdAt,
  updated_at: row.updatedAt,
})

export const getDeposits = async (
  page: number,
  limit: number,
  search: string,
  status?: string
): Promise<TDepositResponse> => {
  const response = await requestJson<BackendDepositWithdrawalListResponse>(
    `/api/proxy/deposit-withdrawal?${buildListQuery(
      { page, limit, search, status },
      "deposit"
    )}`,
    {
      method: "GET",
      defaultErrorMessage: "Failed to fetch deposits",
    }
  )

  return {
    data: response.data.map(mapDeposit),
    pagination: {
      page: response.meta.page,
      limit: response.meta.limit,
      total: response.meta.total,
      totalPages: response.meta.totalPages,
    },
  }
}

export const getWithdrawals = async (
  page: number,
  limit: number,
  search: string,
  status?: string
): Promise<TWithdrawalsResponse> => {
  const response = await requestJson<BackendDepositWithdrawalListResponse>(
    `/api/proxy/deposit-withdrawal?${buildListQuery(
      { page, limit, search, status },
      "withdraw"
    )}`,
    {
      method: "GET",
      defaultErrorMessage: "Failed to fetch withdrawals",
    }
  )

  return {
    data: response.data.map(mapWithdrawal),
    pagination: {
      page: response.meta.page,
      limit: response.meta.limit,
      total: response.meta.total,
      totalPages: response.meta.totalPages,
    },
  }
}

export const getDepositOverview = () =>
  requestJson<TDepositOverviewResponse>(
    "/api/proxy/deposit-withdrawal/overview?type=deposit",
    {
      method: "GET",
      defaultErrorMessage: "Failed to fetch deposit overview",
    }
  )

export const getWithdrawalOverview = () =>
  requestJson<TWithdrawalOverviewResponse>(
    "/api/proxy/deposit-withdrawal/overview?type=withdraw",
    {
      method: "GET",
      defaultErrorMessage: "Failed to fetch withdrawal overview",
    }
  )

export const approveDepositWithdrawal = (
  id: string,
  payload: TApproveRequestPayload
) =>
  requestJson(`/api/proxy/deposit-withdrawal/${id}/approve`, {
    method: "POST",
    body: JSON.stringify(payload),
    defaultErrorMessage: "Failed to approve request",
  })

export const rejectDepositWithdrawal = (
  id: string,
  payload: TRejectRequestPayload
) =>
  requestJson(`/api/proxy/deposit-withdrawal/${id}/reject`, {
    method: "POST",
    body: JSON.stringify(payload),
    defaultErrorMessage: "Failed to reject request",
  })
