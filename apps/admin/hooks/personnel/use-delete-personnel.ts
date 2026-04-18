import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { PERSONNEL_LIST_QUERY_KEY } from "./use-personnel"

const deletePersonnel = async (id: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return id
}

export const useDeletePersonnel = (): UseMutationResult<
  string,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePersonnel,
    mutationKey: [PERSONNEL_LIST_QUERY_KEY, "delete"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PERSONNEL_LIST_QUERY_KEY],
      })
    },
  })
}
