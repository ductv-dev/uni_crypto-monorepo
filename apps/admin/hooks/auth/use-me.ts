import { mapAdminProfile } from "@/lib/auth/admin-access"
import { getCurrentAdmin } from "@/lib/api/users"
import { useAdmin } from "@/store/admin-store"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useMe = () => {
  const { setAdmin, clearAdmin } = useAdmin()

  const query = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentAdmin,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    if (query.data) {
      // FE chỉ giữ lại shape admin nội bộ sau khi profile BE đã qua bước verify role.
      const adminProfile = mapAdminProfile(query.data)

      if (adminProfile) {
        setAdmin(adminProfile)
      } else {
        // Trường hợp hiếm: API trả về user nhưng không map được thành admin hợp lệ.
        clearAdmin()
      }
    }
  }, [clearAdmin, query.data, setAdmin])

  return query
}
