import { createAdminAccount } from "@/lib/api/access-control"
import { CreatePersonnelSchemaType } from "@/schema/personnel.schema"
import { TPersonnel } from "@/types/personnel.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { PERSONNEL_LIST_QUERY_KEY } from "./use-personnel"

export const useCreatePersonnel = (): UseMutationResult<
  TPersonnel | null,
  Error,
  CreatePersonnelSchemaType
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [PERSONNEL_LIST_QUERY_KEY, "create"],
    mutationFn: async (data) => {
      await createAdminAccount({
        email: data.email,
        password: data.password,
        id_role: data.roleId,
      })

      return null
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PERSONNEL_LIST_QUERY_KEY],
      })
    },
  })
}
