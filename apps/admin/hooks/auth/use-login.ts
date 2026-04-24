import { api } from "@/lib/api/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { useRouter } from "next/navigation"

export const useLogin = () => {
  const route = useRouter()
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
      route.push("/dashboard")
    },
  })
}
