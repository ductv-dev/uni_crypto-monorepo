export type TAdmin = {
  name: string
  email: string
  phone: string
  avatar: string
  role: TRole
  status: TStatus
}
export type TRole = "super_admin" | "admin"
export type TStatus = "active" | "inactive" | "banned"
