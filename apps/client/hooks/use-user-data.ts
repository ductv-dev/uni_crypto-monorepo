import { fetchCurrentUser, updateUser } from "@/lib/data/user"
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query"
import { TUser } from "@workspace/shared/types"

const USER_QUERY_KEY = ["user", "current"]

export const useUserData = (): UseQueryResult<TUser, Error> => {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 30, // 30 phút - dữ liệu user ít thay đổi
    gcTime: 1000 * 60 * 60, // 60 phút
  })
}

/** Hook cập nhật thông tin user, tự động cập nhật cache sau khi mutation thành công */
export const useUpdateUser = (): UseMutationResult<
  TUser,
  Error,
  Partial<TUser>
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // Cập nhật cache với dữ liệu mới
      queryClient.setQueryData(USER_QUERY_KEY, data)
    },
  })
}

/** Hook tiện ích kết hợp data và hàm cập nhật user */
export const useUser = () => {
  const userQuery = useUserData()
  const updateMutation = useUpdateUser()

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  }
}
