import { login } from "@/lib/api/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@workspace/ui/index"
import { useRouter } from "next/navigation"

export const useLogin = () => {
  const router = useRouter()
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["me"] }),
        queryClient.invalidateQueries({ queryKey: ["user", "current"] }),
        queryClient.invalidateQueries({ queryKey: ["user", "wallets"] }),
      ])
      toast.success("Đăng nhập thành công")
      router.push("/user/home")
    },
  })
}
