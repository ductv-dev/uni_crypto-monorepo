import { requestJson } from "@/lib/api/client"

export type LoginPayload = {
  email: string
  password: string
}

export type ActivateAccountPayload = {
  token: string
  email: string
}

export type AuthUserSummary = {
  email: string
}

export type LoginResponse = {
  success: boolean
  user: AuthUserSummary
}

export type LogoutResponse = {
  success: boolean
  message: string
}

export const login = (data: LoginPayload) =>
  requestJson<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    defaultErrorMessage: "Login failed",
  })

export const logout = () =>
  requestJson<LogoutResponse>("/api/auth/logout", {
    method: "POST",
    defaultErrorMessage: "Logout failed",
  })

export const activateAccount = (data: ActivateAccountPayload) =>
  requestJson("/api/auth/activate-account", {
    method: "POST",
    body: JSON.stringify(data),
    defaultErrorMessage: "Account activation failed",
  })
