import { env } from "@/lib/constants/env"

export type ApiErrorResponse = {
  message?: string
  error?: string
  statusCode?: number
  [key: string]: unknown
}

export type BackendAuthResponse = {
  access_token?: string
  accessToken?: string
  refresh_token?: string
  refreshToken?: string
  user?: unknown
  [key: string]: unknown
}

export type BackendRefreshResponse = {
  access_token?: string
  accessToken?: string
  refresh_token?: string
  refreshToken?: string
  [key: string]: unknown
}

export type NormalizedAuthTokens = {
  accessToken: string | null
  refreshToken: string | null
}

export const normalizeAuthTokens = (
  payload: BackendAuthResponse | BackendRefreshResponse | null | undefined
): NormalizedAuthTokens => {
  const accessToken =
    typeof payload?.access_token === "string"
      ? payload.access_token
      : typeof payload?.accessToken === "string"
        ? payload.accessToken
        : null

  const refreshToken =
    typeof payload?.refresh_token === "string"
      ? payload.refresh_token
      : typeof payload?.refreshToken === "string"
        ? payload.refreshToken
        : null

  return { accessToken, refreshToken }
}

export const buildBackendUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${env.backendApiUrl}${normalizedPath}`
}

export const backendFetch = (path: string, options?: RequestInit) =>
  fetch(buildBackendUrl(path), options)
