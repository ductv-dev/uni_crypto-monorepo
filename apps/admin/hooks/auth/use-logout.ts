import { logout } from "@/lib/api/auth"
import { useAdmin } from "@/store/admin-store"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { useRouter } from "next/navigation"

export const useLogout = () => {
  const route = useRouter()
  const clearAdmin = useAdmin((state) => state.clearAdmin)
  return useMutation({
    mutationFn: logout,
    mutationKey: ["logout"],
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Không thể đăng xuất"
      )
    },
    onSuccess: () => {
      clearAdmin()
      toast.success("Đăng xuất thành công")
      route.push("/login")
    },
  })
}
