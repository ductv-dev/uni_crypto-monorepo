import { getAccessToken, getRefreshToken } from "@/lib/auth/cookies"
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

export const refreshAccessToken = async (
  refreshToken: string
): Promise<RefreshAccessTokenResult | null> => {
  try {
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

export const getValidAccessToken = async (
  options: ValidAccessTokenOptions = {}
): Promise<RefreshAccessTokenResult | null> => {
  const accessToken = options.accessToken ?? (await getAccessToken()) ?? null
  const refreshToken = options.refreshToken ?? (await getRefreshToken()) ?? null
  const skewSeconds = options.skewSeconds ?? 30

  if (accessToken && !isJwtExpired(accessToken, skewSeconds)) {
    return { accessToken }
  }

  if (!refreshToken) {
    return null
  }

  return refreshAccessToken(refreshToken)
}
