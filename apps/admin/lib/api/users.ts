import { requestJson } from "@/lib/api/client"

export type BackendAdminRole = {
  id: string
  name: string
  level?: number | null
  status?: boolean
}

export type BackendAdminInfo = {
  first_name?: string | null
  last_name?: string | null
  phone_number?: string | null
  avatar?: string | null
}

export type BackendAdminUser = {
  id: string
  email: string
  is_active: boolean
  is_blocked: boolean
  is_super_admin: boolean
  type_account: string
  role: BackendAdminRole | null
  info?: BackendAdminInfo | null
}

export const getCurrentAdmin = () =>
  requestJson<BackendAdminUser>("/api/me", {
    method: "GET",
    defaultErrorMessage: "Unauthorized",
  })

export type BackendUsersResponse = {
  data: unknown[]
  pagination?: {
    limit?: number
    offset?: number
    total?: number
    totalPages?: number
  }
}

export const getUsers = (searchParams = "") =>
  requestJson<BackendUsersResponse>(`/api/proxy/account${searchParams}`, {
    method: "GET",
    defaultErrorMessage: "Failed to fetch users",
  })
