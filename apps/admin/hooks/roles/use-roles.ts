import { getRoles } from "@/lib/api/access-control"
import { TRole } from "@/types/role.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const ROLE_LIST_QUERY_KEY = "roles-list"

const mapRole = (
  role: Awaited<ReturnType<typeof getRoles>>[number]
): TRole => ({
  id: role.id,
  name: role.name,
  description: role.description ?? "Chưa có mô tả",
  level: role.level,
  usersCount: role._count?.users ?? 0,
  status: role.status ? "active" : "inactive",
})

export const useGetRoles = (): UseQueryResult<TRole[], Error> => {
  return useQuery({
    queryKey: [ROLE_LIST_QUERY_KEY],
    queryFn: async () => {
      const roles = await getRoles()
      return roles.map(mapRole)
    },
  })
}
