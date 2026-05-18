import { deleteRole } from "@/lib/api/access-control"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { ROLE_LIST_QUERY_KEY } from "./use-roles"

export const useDeleteRole = (): UseMutationResult<string, Error, string> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [ROLE_LIST_QUERY_KEY, "delete"],
    mutationFn: async (id) => {
      await deleteRole(id)
      return id
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ROLE_LIST_QUERY_KEY],
      })
    },
  })
}
