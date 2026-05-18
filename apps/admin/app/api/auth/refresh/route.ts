import { NextResponse } from "next/server"
import {
  clearAdminAuthCookies,
  getAdminRefreshToken,
  setAdminAccessTokenCookie,
  setAdminRefreshTokenCookie,
} from "@/lib/auth/cookies"
import { refreshAdminAccessToken } from "@/lib/auth/session"

export async function POST() {
  try {
    const refreshToken = await getAdminRefreshToken()
    if (!refreshToken) {
      return clearAdminAuthCookies(
        NextResponse.json({ message: "Missing refresh token" }, { status: 401 })
      )
    }

    const refreshedTokens = await refreshAdminAccessToken(refreshToken)
    if (!refreshedTokens) {
      return clearAdminAuthCookies(
        NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      )
    }

    const response = NextResponse.json({
      success: true,
    })

    setAdminAccessTokenCookie(response, refreshedTokens.accessToken)
    if (refreshedTokens.refreshToken) {
      setAdminRefreshTokenCookie(response, refreshedTokens.refreshToken)
    }

    return response
  } catch (error) {
    console.error("Admin refresh route error:", error)
    return clearAdminAuthCookies(
      NextResponse.json(
        { message: "Không thể làm mới phiên đăng nhập" },
        { status: 500 }
      )
    )
  }
}
