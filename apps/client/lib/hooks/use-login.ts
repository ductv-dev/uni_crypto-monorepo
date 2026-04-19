import { api } from "@/lib/api/api"
import { useUser } from "@/store/user-store"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { useRouter } from "next/navigation"

export const useLogin = () => {
  const router = useRouter()
  const setUser = useUser((state) => state.setUser)

  return useMutation({
    mutationFn: api.login,
    mutationKey: ["login"],
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Không thể đăng nhập"
      )
    },
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user)
      }
      toast.success("Đăng nhập thành công")
      router.push("/user/home")
    },
  })
}
