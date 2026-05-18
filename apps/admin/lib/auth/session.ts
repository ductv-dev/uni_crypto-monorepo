import { getAdminAccessToken, getAdminRefreshToken } from "@/lib/auth/cookies"
import { isJwtExpired } from "@/lib/auth/tokens"
import {
  backendFetch,
  normalizeAuthTokens,
  type BackendRefreshResponse,
} from "@/lib/api/backend-client"

export type RefreshAccessTokenResult = {
  accessToken: string
  refreshToken?: string
}

export const refreshAdminAccessToken = async (
  refreshToken: string
): Promise<RefreshAccessTokenResult | null> => {
  try {
    // Next.js chỉ gọi refresh endpoint; backend mới là nơi verify JWT + session DB thật sự.
    const refreshResponse = await backendFetch("/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    if (!refreshResponse.ok) {
      return null
    }

    const responseBody =
      ((await refreshResponse
        .json()
        .catch(() => null)) as BackendRefreshResponse | null) || null
    const tokens = normalizeAuthTokens(responseBody)

    if (!tokens.accessToken) {
      return null
    }

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || undefined,
    }
  } catch {
    return null
  }
}

type ValidAccessTokenOptions = {
  accessToken?: string | null
  refreshToken?: string | null
  skewSeconds?: number
}

export const getValidAdminAccessToken = async (
  options: ValidAccessTokenOptions = {}
): Promise<RefreshAccessTokenResult | null> => {
  const accessToken =
    options.accessToken ?? (await getAdminAccessToken()) ?? null
  const refreshToken =
    options.refreshToken ?? (await getAdminRefreshToken()) ?? null
  const skewSeconds = options.skewSeconds ?? 30

  if (accessToken && !isJwtExpired(accessToken, skewSeconds)) {
    return { accessToken }
  }

  // Access token thiếu/hết hạn -> fallback qua refresh token.
  if (!refreshToken) {
    return null
  }

  return refreshAdminAccessToken(refreshToken)
}
