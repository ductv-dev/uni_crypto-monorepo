import { getCurrentUser } from "@/lib/api/users"
import { useUser } from "@/store/user-store"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useMe = () => {
  const { setUser } = useUser()

  const query = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (query.data) {
      const user = query.data
      setUser({
        id: user.id,
        name: user.info?.first_name
          ? `${user.info.first_name} ${user.info.last_name || ""}`.trim()
          : user.email,
        email: user.email,
        phone: user.info?.phone_number || "",
        avatar: user.info?.avatar || "",
      })
    }
  }, [query.data, setUser])

  return query
}
