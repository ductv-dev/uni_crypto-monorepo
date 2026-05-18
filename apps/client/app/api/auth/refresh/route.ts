import { NextResponse } from "next/server"
import {
  clearAuthCookies,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/lib/auth/cookies"
import { refreshAccessToken } from "@/lib/auth/session"

export async function POST() {
  try {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
      return clearAuthCookies(
        NextResponse.json({ message: "Missing refresh token" }, { status: 401 })
      )
    }

    const refreshedTokens = await refreshAccessToken(refreshToken)
    if (!refreshedTokens) {
      return clearAuthCookies(
        NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      )
    }

    const response = NextResponse.json({ success: true })
    setAccessTokenCookie(response, refreshedTokens.accessToken)
    if (refreshedTokens.refreshToken) {
      setRefreshTokenCookie(response, refreshedTokens.refreshToken)
    }
    return response
  } catch (error) {
    console.error("Client refresh route error:", error)
    return clearAuthCookies(
      NextResponse.json(
        { message: "Không thể làm mới phiên đăng nhập" },
        { status: 500 }
      )
    )
  }
}
