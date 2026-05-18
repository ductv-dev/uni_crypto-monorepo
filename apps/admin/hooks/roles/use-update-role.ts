import { updateRole } from "@/lib/api/access-control"
import { RoleSchemaType } from "@/schema/role.schema"
import { TRole } from "@/types/role.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { ROLE_LIST_QUERY_KEY } from "./use-roles"

const mapRole = (
  role: Awaited<ReturnType<typeof updateRole>>["data"]
): TRole => ({
  id: role.id,
  name: role.name,
  description: role.description ?? "Chưa có mô tả",
  level: role.level,
  usersCount: role._count?.users ?? 0,
  status: role.status ? "active" : "inactive",
})

export const useUpdateRole = (
  id: string
): UseMutationResult<TRole, Error, RoleSchemaType> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [ROLE_LIST_QUERY_KEY, "update", id],
    mutationFn: async (data) =>
      mapRole(
        (
          await updateRole(id, {
            name: data.name,
            description: data.description,
            level: data.level,
            status: data.status === "active",
          })
        ).data
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ROLE_LIST_QUERY_KEY],
      })
    },
  })
}
