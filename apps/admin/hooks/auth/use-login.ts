import { login } from "@/lib/api/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { useRouter, useSearchParams } from "next/navigation"
import { DEFAULT_AUTHENTICATED_REDIRECT } from "@/lib/constants/routes"
import { getSafeRedirectPath } from "@/lib/utils/safe-redirect"

export const useLogin = () => {
  const route = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    mutationKey: ["login"],
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Không thể đăng nhập"
      )
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] })
      toast.success("Đăng nhập thành công")
      const redirectPath = getSafeRedirectPath(
        searchParams.get("next"),
        DEFAULT_AUTHENTICATED_REDIRECT
      )
      route.push(redirectPath)
    },
  })
}
