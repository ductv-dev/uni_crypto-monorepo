import { PersonnelSchemaType } from "@/schema/personnel.schema"
import { TPersonnel } from "@/types/personnel.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { PERSONNEL_LIST_QUERY_KEY } from "./use-personnel"

const updatePersonnel = async (
  id: string,
  data: PersonnelSchemaType
): Promise<TPersonnel> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    id,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    status: data.status,
    lastActive: "Just now",
    joinedDate: "2023-01-01",
  }
}

export const useUpdatePersonnel = (
  id: string
): UseMutationResult<TPersonnel, Error, PersonnelSchemaType> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [PERSONNEL_LIST_QUERY_KEY, "update", id],
    mutationFn: (data) => updatePersonnel(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PERSONNEL_LIST_QUERY_KEY],
      })
    },
  })
}
