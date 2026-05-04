import { api } from "@/lib/api/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { useRouter, useSearchParams } from "next/navigation"

const DEFAULT_REDIRECT = "/dashboard"

const getSafeRedirectPath = (pathname: string | null) => {
  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) {
    return DEFAULT_REDIRECT
  }

  return pathname
}

export const useLogin = () => {
  const route = useRouter()
  const searchParams = useSearchParams()
  return useMutation({
    mutationFn: api.login,
    mutationKey: ["login"],
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Không thể đăng nhập"
      )
    },
    onSuccess: () => {
      toast.success("Đăng nhập thành công")
      const redirectPath = getSafeRedirectPath(searchParams.get("next"))
      route.push(redirectPath)
    },
  })
}
