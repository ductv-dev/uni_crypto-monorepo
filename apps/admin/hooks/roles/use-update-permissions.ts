import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { ROLE_LIST_QUERY_KEY } from "./use-roles"
import { ROLE_PERMISSIONS_QUERY_KEY } from "./use-role-permissions"

const updatePermissions = async (
  id: string,
  permissions: string[]
): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return permissions
}

export const useUpdatePermissions = (
  id: string
): UseMutationResult<string[], Error, string[]> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [ROLE_LIST_QUERY_KEY, "update-permissions", id],
    mutationFn: (data) => updatePermissions(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [ROLE_LIST_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [ROLE_PERMISSIONS_QUERY_KEY, id],
        }),
      ])
    },
  })
}
