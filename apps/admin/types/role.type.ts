export interface TRole {
  id: string
  name: string
  description: string
  usersCount: number
  status: "active" | "inactive"
}

export type TPermissionGroup = {
  module: string
  actions: string[]
}

export type TRolePermissionsResponse = {
  roleId: string
  permissions: string[]
}
