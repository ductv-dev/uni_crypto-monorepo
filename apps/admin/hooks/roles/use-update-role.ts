import { RoleSchemaType } from "@/schema/role.schema"
import { TRole } from "@/types/role.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { ROLE_LIST_QUERY_KEY } from "./use-roles"

const updateRole = async (id: string, data: RoleSchemaType): Promise<TRole> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    id,
    name: data.name,
    description: data.description,
    status: data.status,
    usersCount: 0,
  }
}

export const useUpdateRole = (
  id: string
): UseMutationResult<TRole, Error, RoleSchemaType> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [ROLE_LIST_QUERY_KEY, "update", id],
    mutationFn: (data) => updateRole(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ROLE_LIST_QUERY_KEY],
      })
    },
  })
}
