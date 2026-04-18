import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { ROLE_LIST_QUERY_KEY } from "./use-roles"

const deleteRole = async (id: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return id
}

export const useDeleteRole = (): UseMutationResult<string, Error, string> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [ROLE_LIST_QUERY_KEY, "delete"],
    mutationFn: deleteRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [ROLE_LIST_QUERY_KEY],
      })
    },
  })
}
