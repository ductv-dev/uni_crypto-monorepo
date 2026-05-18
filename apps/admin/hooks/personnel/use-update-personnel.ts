import { updateAdminAccountRole } from "@/lib/api/access-control"
import { UpdatePersonnelSchemaType } from "@/schema/personnel.schema"
import { TPersonnel } from "@/types/personnel.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { PERSONNEL_LIST_QUERY_KEY } from "./use-personnel"

export const useUpdatePersonnel = (
  id: string
): UseMutationResult<TPersonnel | null, Error, UpdatePersonnelSchemaType> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [PERSONNEL_LIST_QUERY_KEY, "update", id],
    mutationFn: async (data) => {
      await updateAdminAccountRole(id, data.roleId)
      return null
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PERSONNEL_LIST_QUERY_KEY],
      })
    },
  })
}
