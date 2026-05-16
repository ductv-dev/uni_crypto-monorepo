import { api } from "@/lib/api/api"
import { useAdmin } from "@/store/admin-store"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useMe = () => {
  const { setAdmin } = useAdmin()

  const query = useQuery({
    queryKey: ["me"],
    queryFn: api.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    if (query.data) {
      const user = query.data
      setAdmin({
        name: user.info?.first_name
          ? `${user.info.first_name} ${user.info.last_name || ""}`.trim()
          : user.email,
        email: user.email,
        phone: user.info?.phone_number || "",
        avatar: user.info?.avatar || "",
        role: user.is_super_admin ? "super_admin" : "admin",
        status: user.is_blocked
          ? "banned"
          : user.is_active
            ? "active"
            : "inactive",
      })
    }
  }, [query.data, setAdmin])

  return query
}
