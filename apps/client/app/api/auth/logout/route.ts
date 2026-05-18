import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/api/backend-client"
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
} from "@/lib/auth/cookies"

export async function POST() {
  try {
    const accessToken = await getAccessToken()
    const refreshToken = await getRefreshToken()

    if (accessToken) {
      await backendFetch("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshToken || "" }),
      }).catch(() => null)
    }

    return clearAuthCookies(
      NextResponse.json({
        success: true,
        message: "Đăng xuất thành công",
      })
    )
  } catch (error) {
    console.error("Client logout route error:", error)
    return clearAuthCookies(
      NextResponse.json(
        { message: "Không thể đăng xuất ở thời điểm hiện tại" },
        { status: 500 }
      )
    )
  }
}
