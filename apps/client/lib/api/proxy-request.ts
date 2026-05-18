import { NextResponse } from "next/server"
import {
  clearAuthCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/lib/auth/cookies"
import { backendFetch, type ApiErrorResponse } from "@/lib/api/backend-client"
import { refreshAccessToken } from "@/lib/auth/session"

type ProxyBackendRequestOptions = {
  method: string
  path: string
  search?: string
  headers?: HeadersInit
  body?: BodyInit | null
  accessToken?: string | null
  refreshToken?: string | null
  retryOnUnauthorized?: boolean
}

const buildPathWithSearch = (path: string, search?: string) => {
  if (!search) {
    return path
  }

  return `${path}${search.startsWith("?") ? search : `?${search}`}`
}

const parseBackendError = async (
  response: Response
): Promise<ApiErrorResponse> => {
  return (await response.json().catch(() => null)) || {}
}

const createUnauthorizedResponse = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 })

const createBackendUnavailableResponse = () =>
  NextResponse.json({ message: "Backend service unavailable" }, { status: 503 })

const forwardToBackend = async (
  options: ProxyBackendRequestOptions,
  accessToken: string
) => {
  const headers = new Headers(options.headers)
  headers.set("Authorization", `Bearer ${accessToken}`)

  return backendFetch(buildPathWithSearch(options.path, options.search), {
    method: options.method,
    headers,
    body: options.body,
  })
}

const createBackendResponse = async (response: Response) => {
  const rawBody = await response.text()
  const backendContentType = response.headers.get("content-type")
  const proxiedResponse = new NextResponse(rawBody, {
    status: response.status,
    statusText: response.statusText,
  })

  if (backendContentType) {
    proxiedResponse.headers.set("Content-Type", backendContentType)
  }

  return proxiedResponse
}

export const proxyBackendRequest = async (
  options: ProxyBackendRequestOptions
): Promise<NextResponse> => {
  const {
    accessToken,
    refreshToken,
    retryOnUnauthorized = true,
    ...requestOptions
  } = options

  if (!accessToken && !refreshToken) {
    return clearAuthCookies(createUnauthorizedResponse())
  }

  const currentAccessToken = accessToken
  if (!currentAccessToken) {
    const refreshedTokens = await refreshAccessToken(refreshToken!)
    if (!refreshedTokens) {
      return clearAuthCookies(createUnauthorizedResponse())
    }

    let retryResponse: Response
    try {
      retryResponse = await forwardToBackend(
        requestOptions,
        refreshedTokens.accessToken
      )
    } catch {
      return createBackendUnavailableResponse()
    }

    const proxiedRetryResponse = await createBackendResponse(retryResponse)
    setAccessTokenCookie(proxiedRetryResponse, refreshedTokens.accessToken)
    if (refreshedTokens.refreshToken) {
      setRefreshTokenCookie(proxiedRetryResponse, refreshedTokens.refreshToken)
    }
    return proxiedRetryResponse
  }

  let backendResponse: Response
  try {
    backendResponse = await forwardToBackend(requestOptions, currentAccessToken)
  } catch {
    return createBackendUnavailableResponse()
  }

  if (backendResponse.status !== 401 || !retryOnUnauthorized) {
    return createBackendResponse(backendResponse)
  }

  if (!refreshToken) {
    return clearAuthCookies(createUnauthorizedResponse())
  }

  const refreshedTokens = await refreshAccessToken(refreshToken)
  if (!refreshedTokens) {
    return clearAuthCookies(createUnauthorizedResponse())
  }

  let retriedResponse: Response
  try {
    retriedResponse = await forwardToBackend(
      requestOptions,
      refreshedTokens.accessToken
    )
  } catch {
    return createBackendUnavailableResponse()
  }

  if (retriedResponse.status === 401) {
    const errorPayload = await parseBackendError(retriedResponse)
    return clearAuthCookies(
      NextResponse.json(
        { message: errorPayload.message || "Unauthorized" },
        { status: 401 }
      )
    )
  }

  const proxiedResponse = await createBackendResponse(retriedResponse)
  setAccessTokenCookie(proxiedResponse, refreshedTokens.accessToken)
  if (refreshedTokens.refreshToken) {
    setRefreshTokenCookie(proxiedResponse, refreshedTokens.refreshToken)
  }
  return proxiedResponse
}
