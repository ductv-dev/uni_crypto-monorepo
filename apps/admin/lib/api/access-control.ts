import { requestJson } from "@/lib/api/client"

export type BackendRole = {
  id: string
  name: string
  description?: string | null
  status: boolean
  level: number
  _count?: {
    users: number
  }
}

export type BackendPermission = {
  id: string
  permission_code: string
  name: string
  description?: string | null
  status: boolean
}

export type BackendPermissionListResponse = {
  data: BackendPermission[]
  pagination: {
    total: number | string
    totalPages: number | string
    limit: number | string
    offset: number | string
  }
}

export type BackendRolePermissionsResponse = BackendRole & {
  permissions: Array<{
    permission: BackendPermission
  }>
}

export type BackendAccountListItem = {
  id: string
  email: string
  type_account: string
  createdAt: string
  updatedAt: string
  first_name?: string | null
  last_name?: string | null
  phone_number?: string | null
  is_active: boolean
  is_blocked: boolean
  address?: string | null
  city?: string | null
  country?: string | null
  role_id?: string | null
  role_name?: string | null
}

export type BackendAccountsResponse = {
  data: BackendAccountListItem[]
  meta: {
    total: number | string
    limit: number | string
    offset: number | string
    totalPages?: number | string
  }
}

export type CreateRolePayload = {
  name: string
  description: string
  level: number
  status: boolean
}

export type UpdateRolePayload = Partial<CreateRolePayload>

export type CreateAdminAccountPayload = {
  email: string
  password: string
  id_role: string
}

export type GetAdminAccountsParams = {
  limit: number
  offset: number
  search?: string
  roleId?: string
  status?: "active" | "inactive" | "blocked"
}

const moduleLabelMap: Record<string, string> = {
  audit_logs: "Nhật ký hệ thống",
  assets: "Tài sản",
  deposit_withdrawals: "Nạp rút",
  markets: "Thị trường",
  order_books: "Sổ lệnh",
  permissions: "Quyền hệ thống",
  role_permissions: "Phân quyền vai trò",
  roles: "Vai trò",
  sessions: "Phiên đăng nhập",
  trades: "Giao dịch",
  user_infos: "Hồ sơ người dùng",
  users: "Tài khoản",
  wallets: "Ví",
  wallet_transactions: "Biến động ví",
}

const actionLabelMap: Record<string, string> = {
  read: "Xem",
  create: "Tạo",
  update: "Cập nhật",
  delete: "Xóa",
}

const buildQueryString = (
  params: Record<string, string | number | undefined>
) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return
    }

    searchParams.set(key, String(value))
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

const toSafeNumber = (value: number | string | undefined, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

export const getRoles = () =>
  requestJson<BackendRole[]>("/api/proxy/role", {
    method: "GET",
    defaultErrorMessage: "Không thể tải danh sách vai trò",
  })

export const createRole = (payload: CreateRolePayload) =>
  requestJson<BackendRole>("/api/proxy/role", {
    method: "POST",
    body: JSON.stringify(payload),
    defaultErrorMessage: "Không thể tạo vai trò",
  })

export const updateRole = (id: string, payload: UpdateRolePayload) =>
  requestJson<{ message: string; data: BackendRole }>(`/api/proxy/role/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    defaultErrorMessage: "Không thể cập nhật vai trò",
  })

export const deleteRole = (id: string) =>
  requestJson<{ message: string; data: BackendRole }>(`/api/proxy/role/${id}`, {
    method: "DELETE",
    defaultErrorMessage: "Không thể xóa vai trò",
  })

export const getPermissions = async (limit = 100) => {
  const response = await requestJson<BackendPermissionListResponse>(
    `/api/proxy/permission${buildQueryString({ limit: toSafeNumber(limit, 100) })}`,
    {
      method: "GET",
      defaultErrorMessage: "Không thể tải danh sách quyền",
    }
  )

  return {
    ...response,
    pagination: {
      total: toSafeNumber(response.pagination.total, 0),
      totalPages: toSafeNumber(response.pagination.totalPages, 0),
      limit: toSafeNumber(response.pagination.limit, limit),
      offset: toSafeNumber(response.pagination.offset, 0),
    },
  }
}

export const getRolePermissions = (roleId: string) =>
  requestJson<BackendRolePermissionsResponse>(
    `/api/proxy/role/${roleId}/permission`,
    {
      method: "GET",
      defaultErrorMessage: "Không thể tải phân quyền của vai trò",
    }
  )

export const updateRolePermissions = (
  roleId: string,
  permissionIds: string[]
) =>
  requestJson<{ message: string }>(`/api/proxy/role/${roleId}/permission`, {
    method: "PATCH",
    body: JSON.stringify({ permission_id: permissionIds }),
    defaultErrorMessage: "Không thể cập nhật phân quyền",
  })

export const getAdminAccounts = async (params: GetAdminAccountsParams) => {
  const safeLimit = toSafeNumber(params.limit, 10)
  const safeOffset = toSafeNumber(params.offset, 0)

  const response = await requestJson<BackendAccountsResponse>(
    `/api/proxy/account${buildQueryString({
      limit: safeLimit,
      offset: safeOffset,
      search: params.search?.trim(),
      roleId: params.roleId,
      status: params.status,
      type: "admin",
    })}`,
    {
      method: "GET",
      defaultErrorMessage: "Không thể tải danh sách tài khoản quản trị",
    }
  )

  return {
    ...response,
    meta: {
      total: toSafeNumber(response.meta.total, 0),
      limit: toSafeNumber(response.meta.limit, safeLimit),
      offset: toSafeNumber(response.meta.offset, safeOffset),
      totalPages:
        response.meta.totalPages === undefined
          ? undefined
          : toSafeNumber(response.meta.totalPages, 0),
    },
  }
}

export const createAdminAccount = (payload: CreateAdminAccountPayload) =>
  requestJson<{ message: string; data: { id: string } }>("/api/proxy/account", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      type: "admin",
      is_super_admin: false,
      is_active: true,
      is_blocked: false,
      id_role: payload.id_role,
    }),
    defaultErrorMessage: "Không thể tạo tài khoản quản trị",
  })

export const updateAdminAccountRole = (accountId: string, roleId: string) =>
  requestJson<{ message: string }>(
    `/api/proxy/account/update-role/${accountId}`,
    {
      method: "POST",
      body: JSON.stringify({ role_id: roleId }),
      defaultErrorMessage: "Không thể cập nhật vai trò cho tài khoản",
    }
  )

export const toggleAdminAccountBlock = (accountId: string) =>
  requestJson<{ message: string }>(`/api/proxy/account/block/${accountId}`, {
    method: "PATCH",
    defaultErrorMessage: "Không thể thay đổi trạng thái khóa tài khoản",
  })

export const derivePersonnelStatus = (
  isActive: boolean,
  isBlocked: boolean
): "active" | "inactive" | "blocked" => {
  if (isBlocked) {
    return "blocked"
  }

  return isActive ? "active" : "inactive"
}

export const buildDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
  email?: string
): string => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim()

  if (fullName) {
    return fullName
  }

  if (!email) {
    return "Chưa cập nhật"
  }

  return email.split("@")[0] || email
}

export const getPermissionModuleLabel = (permissionCode: string) => {
  const [moduleCode = ""] = permissionCode.split(".")
  return moduleLabelMap[moduleCode] || moduleCode.replaceAll("_", " ")
}

export const getPermissionLabel = (permission: BackendPermission) => {
  if (permission.name?.trim()) {
    return permission.name
  }

  const [moduleCode = "", actionCode = ""] =
    permission.permission_code.split(".")
  const moduleLabel = moduleLabelMap[moduleCode] || moduleCode
  const actionLabel = actionLabelMap[actionCode] || actionCode

  return `${actionLabel} ${moduleLabel}`
}
