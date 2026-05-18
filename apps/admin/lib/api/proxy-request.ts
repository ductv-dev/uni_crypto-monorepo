import { NextResponse } from "next/server"
import {
  clearAdminAuthCookies,
  setAdminAccessTokenCookie,
  setAdminRefreshTokenCookie,
} from "@/lib/auth/cookies"
import { backendFetch, type ApiErrorResponse } from "@/lib/api/backend-client"
import { refreshAdminAccessToken } from "@/lib/auth/session"

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

// Ghép path + query string theo format backend mong đợi.
const buildPathWithSearch = (path: string, search?: string) => {
  if (!search) {
    return path
  }

  return `${path}${search.startsWith("?") ? search : `?${search}`}`
}

// Parse payload lỗi từ backend (nếu có) để trả message nhất quán cho FE.
const parseBackendError = async (
  response: Response
): Promise<ApiErrorResponse> => {
  return (await response.json().catch(() => null)) || {}
}

// Response 401 chuẩn của lớp proxy.
const createUnauthorizedResponse = () =>
  NextResponse.json(
    {
      message: "Unauthorized",
    },
    {
      status: 401,
    }
  )

const createBackendUnavailableResponse = () =>
  NextResponse.json(
    {
      message: "Backend service unavailable",
    },
    {
      status: 503,
    }
  )

// Forward request sang backend và gắn access token vào Authorization header.
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

// Giữ nguyên status/body từ backend để client không bị lệch contract.
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
    return clearAdminAuthCookies(createUnauthorizedResponse())
  }

  // Không có access token nhưng còn refresh token:
  // thử refresh trước rồi gọi backend luôn với token mới.
  const currentAccessToken = accessToken
  if (!currentAccessToken) {
    const refreshedTokens = await refreshAdminAccessToken(refreshToken!)
    if (!refreshedTokens) {
      return clearAdminAuthCookies(createUnauthorizedResponse())
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
    setAdminAccessTokenCookie(proxiedRetryResponse, refreshedTokens.accessToken)
    if (refreshedTokens.refreshToken) {
      setAdminRefreshTokenCookie(
        proxiedRetryResponse,
        refreshedTokens.refreshToken
      )
    }
    return proxiedRetryResponse
  }

  // Có access token thì gọi backend bình thường trước.
  let backendResponse: Response
  try {
    backendResponse = await forwardToBackend(requestOptions, currentAccessToken)
  } catch {
    return createBackendUnavailableResponse()
  }

  if (backendResponse.status !== 401 || !retryOnUnauthorized) {
    return createBackendResponse(backendResponse)
  }

  // Access token hết hạn trong lúc request đang chạy -> refresh rồi retry đúng 1 lần.
  if (!refreshToken) {
    return clearAdminAuthCookies(createUnauthorizedResponse())
  }

  const refreshedTokens = await refreshAdminAccessToken(refreshToken)
  if (!refreshedTokens) {
    return clearAdminAuthCookies(createUnauthorizedResponse())
  }

  // Retry đúng 1 lần sau khi refresh để tránh loop vô hạn.
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
    return clearAdminAuthCookies(
      NextResponse.json(
        {
          message: errorPayload.message || "Unauthorized",
        },
        {
          status: 401,
        }
      )
    )
  }

  const proxiedResponse = await createBackendResponse(retriedResponse)
  setAdminAccessTokenCookie(proxiedResponse, refreshedTokens.accessToken)
  if (refreshedTokens.refreshToken) {
    setAdminRefreshTokenCookie(proxiedResponse, refreshedTokens.refreshToken)
  }
  return proxiedResponse
}
