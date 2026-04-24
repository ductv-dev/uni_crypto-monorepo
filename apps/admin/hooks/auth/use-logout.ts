import { api } from "@/lib/api/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { useRouter } from "next/navigation"

export const useLogout = () => {
  const route = useRouter()
  return useMutation({
    mutationFn: api.logout,
    mutationKey: ["logout"],
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Không thể đăng xuất"
      )
    },
    onSuccess: () => {
      toast.success("Đăng xuất thành công")
      route.push("/login")
    },
  })
}
