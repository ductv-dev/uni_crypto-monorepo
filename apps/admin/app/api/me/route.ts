import { NextResponse } from "next/server"
import { isAllowedAdminUser } from "@/lib/auth/admin-access"
import {
  clearAdminAuthCookies,
  getAdminAccessToken,
  getAdminRefreshToken,
  setAdminAccessTokenCookie,
  setAdminRefreshTokenCookie,
} from "@/lib/auth/cookies"
import { backendFetch } from "@/lib/api/backend-client"
import { type BackendAdminUser } from "@/lib/api/users"
import { refreshAdminAccessToken } from "@/lib/auth/session"

const unauthorizedResponse = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 })

const backendUnavailableResponse = () =>
  NextResponse.json({ message: "Backend service unavailable" }, { status: 503 })

export async function GET() {
  try {
    const accessToken = await getAdminAccessToken()
    const refreshToken = await getAdminRefreshToken()

    if (!accessToken && !refreshToken) {
      return clearAdminAuthCookies(unauthorizedResponse())
    }

    let tokenForRequest = accessToken || null
    let refreshedAccessToken: string | null = null
    let rotatedRefreshToken: string | null = null

    if (!tokenForRequest && refreshToken) {
      const refreshedTokens = await refreshAdminAccessToken(refreshToken)
      if (!refreshedTokens) {
        return clearAdminAuthCookies(unauthorizedResponse())
      }

      tokenForRequest = refreshedTokens.accessToken
      refreshedAccessToken = refreshedTokens.accessToken
      rotatedRefreshToken = refreshedTokens.refreshToken || null
    }

    if (!tokenForRequest) {
      return clearAdminAuthCookies(unauthorizedResponse())
    }

    let backendResponse: Response
    try {
      backendResponse = await backendFetch("/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenForRequest}`,
        },
      })
    } catch {
      return backendUnavailableResponse()
    }

    if (backendResponse.status === 401 && refreshToken) {
      const refreshedTokens = await refreshAdminAccessToken(refreshToken)
      if (!refreshedTokens) {
        return clearAdminAuthCookies(unauthorizedResponse())
      }

      tokenForRequest = refreshedTokens.accessToken
      refreshedAccessToken = refreshedTokens.accessToken
      rotatedRefreshToken = refreshedTokens.refreshToken || null

      try {
        backendResponse = await backendFetch("/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenForRequest}`,
          },
        })
      } catch {
        return backendUnavailableResponse()
      }
    }

    if (!backendResponse.ok) {
      if (backendResponse.status === 401 || backendResponse.status === 403) {
        return clearAdminAuthCookies(
          NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        )
      }

      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: backendResponse.status }
      )
    }

    const userData = (await backendResponse.json()) as BackendAdminUser
    if (!isAllowedAdminUser(userData)) {
      return clearAdminAuthCookies(
        NextResponse.json(
          { message: "Tài khoản này không có quyền truy cập trang admin" },
          { status: 403 }
        )
      )
    }

    const response = NextResponse.json(userData)

    if (refreshedAccessToken) {
      setAdminAccessTokenCookie(response, refreshedAccessToken)
    }

    if (rotatedRefreshToken) {
      setAdminRefreshTokenCookie(response, rotatedRefreshToken)
    }

    return response
  } catch (error) {
    console.error("Error in /api/me:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
