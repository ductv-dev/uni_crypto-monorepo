import { type BackendAdminUser } from "@/lib/api/users"
import { type TAdmin } from "@/types"

export type AdminAppRole = TAdmin["role"]

const ADMIN_ACCOUNT_TYPE = "admin"

// Chuẩn hóa dữ liệu user từ BE về đúng role mà FE admin đang hiểu.
// Nếu không map được thì coi như tài khoản không được vào admin app.
export const getAdminAppRole = (
  user: Pick<BackendAdminUser, "type_account" | "is_super_admin" | "role">
): AdminAppRole | null => {
  if (user.type_account !== ADMIN_ACCOUNT_TYPE) {
    return null
  }

  if (user.is_super_admin) {
    return "super_admin"
  }

  const normalizedRoleName = user.role?.name?.trim().toUpperCase()

  if (!normalizedRoleName || normalizedRoleName === "USER") {
    return null
  }

  return normalizedRoleName === "SUPER_ADMIN" ? "super_admin" : "admin"
}

export const isAllowedAdminUser = (
  user: Pick<BackendAdminUser, "type_account" | "is_super_admin" | "role">
) => getAdminAppRole(user) !== null

// Gom trạng thái hoạt động của tài khoản về 3 trạng thái FE đang dùng.
export const mapAdminStatus = (
  user: Pick<BackendAdminUser, "is_blocked" | "is_active">
): TAdmin["status"] => {
  if (user.is_blocked) {
    return "banned"
  }

  return user.is_active ? "active" : "inactive"
}

// Dùng khi cần đổ dữ liệu user hiện tại vào store admin.
export const mapAdminProfile = (user: BackendAdminUser): TAdmin | null => {
  const role = getAdminAppRole(user)

  if (!role) {
    return null
  }

  return {
    name: user.info?.first_name
      ? `${user.info.first_name} ${user.info.last_name || ""}`.trim()
      : user.email,
    email: user.email,
    phone: user.info?.phone_number || "",
    avatar: user.info?.avatar || "",
    role,
    status: mapAdminStatus(user),
  }
}
