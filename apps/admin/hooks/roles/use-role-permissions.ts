import {
  getPermissionLabel,
  getPermissionModuleLabel,
  getPermissions,
  getRolePermissions,
} from "@/lib/api/access-control"
import { TPermissionGroup, TRolePermissionsResponse } from "@/types/role.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const ROLE_PERMISSIONS_QUERY_KEY = "role-permissions"

const buildPermissionGroups = (
  permissions: Awaited<ReturnType<typeof getPermissions>>["data"]
): TPermissionGroup[] => {
  const groupedPermissions = new Map<string, TPermissionGroup>()

  permissions.forEach((permission) => {
    const moduleLabel = getPermissionModuleLabel(permission.permission_code)
    const group: TPermissionGroup = groupedPermissions.get(moduleLabel) ?? {
      module: moduleLabel,
      permissions: [],
    }

    group.permissions.push({
      id: permission.id,
      code: permission.permission_code,
      label: getPermissionLabel(permission),
      description: permission.description,
      status: permission.status ? "active" : "inactive",
    })

    groupedPermissions.set(moduleLabel, group)
  })

  return Array.from(groupedPermissions.values()).map((group) => ({
    ...group,
    permissions: group.permissions.sort((left, right) =>
      left.label.localeCompare(right.label, "vi")
    ),
  }))
}

export const useRolePermissions = (
  roleId: string,
  enabled = true
): UseQueryResult<TRolePermissionsResponse, Error> => {
  return useQuery({
    queryKey: [ROLE_PERMISSIONS_QUERY_KEY, roleId],
    queryFn: async () => {
      const [rolePermissions, permissions] = await Promise.all([
        getRolePermissions(roleId),
        getPermissions(100),
      ])

      return {
        roleId,
        permissions: rolePermissions.permissions.map(
          (item) => item.permission.id
        ),
        groups: buildPermissionGroups(permissions.data),
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}
