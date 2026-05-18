import { toggleAdminAccountBlock } from "@/lib/api/access-control"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { PERSONNEL_LIST_QUERY_KEY } from "./use-personnel"

export const useTogglePersonnelBlock = (): UseMutationResult<
  string,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await toggleAdminAccountBlock(id)
      return id
    },
    mutationKey: [PERSONNEL_LIST_QUERY_KEY, "toggle-block"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PERSONNEL_LIST_QUERY_KEY],
      })
    },
  })
}
