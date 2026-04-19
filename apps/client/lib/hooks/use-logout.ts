import { api } from "@/lib/api/api"
import { useUser } from "@/store/user-store"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { useRouter } from "next/navigation"

export const useLogout = () => {
  const router = useRouter()
  const clearUser = useUser((state) => state.clearUser)

  return useMutation({
    mutationFn: api.logout,
    mutationKey: ["logout"],
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Không thể đăng xuất"
      )
    },
    onSuccess: () => {
      clearUser()
      toast.success("Đã đăng xuất")
      router.push("/login")
    },
  })
}
