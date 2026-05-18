export interface TRole {
  id: string
  name: string
  description: string
  level: number
  usersCount: number
  status: "active" | "inactive"
}

export type TPermissionOption = {
  id: string
  code: string
  label: string
  description?: string | null
  status: "active" | "inactive"
}

export type TPermissionGroup = {
  module: string
  permissions: TPermissionOption[]
}

export type TRolePermissionsResponse = {
  roleId: string
  permissions: string[]
  groups: TPermissionGroup[]
}
