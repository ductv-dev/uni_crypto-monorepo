import { requestJson } from "@/lib/api/client"

export type BackendUserInfo = {
  first_name?: string | null
  last_name?: string | null
  phone_number?: string | null
  avatar?: string | null
}

export type BackendUser = {
  id: string
  email: string
  info?: BackendUserInfo | null
}

export const getCurrentUser = () =>
  requestJson<BackendUser>("/api/me", {
    method: "GET",
    defaultErrorMessage: "Unauthorized",
  })
