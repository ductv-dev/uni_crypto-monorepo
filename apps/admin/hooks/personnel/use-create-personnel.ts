import { PersonnelSchemaType } from "@/schema/personnel.schema"
import { TPersonnel } from "@/types/personnel.type"
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query"
import { PERSONNEL_LIST_QUERY_KEY } from "./use-personnel"

const createPersonnel = async (
  data: PersonnelSchemaType
): Promise<TPersonnel> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    id: `USR-${Math.floor(Math.random() * 1000)}`,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    status: data.status,
    lastActive: "Never",
    joinedDate: new Date().toISOString().substring(0, 10),
  }
}

export const useCreatePersonnel = (): UseMutationResult<
  TPersonnel,
  Error,
  PersonnelSchemaType
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [PERSONNEL_LIST_QUERY_KEY, "create"],
    mutationFn: createPersonnel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PERSONNEL_LIST_QUERY_KEY],
      })
    },
  })
}
