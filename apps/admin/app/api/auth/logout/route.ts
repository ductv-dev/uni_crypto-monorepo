import { NextResponse } from "next/server"
import {
  clearAdminAuthCookies,
  getAdminAccessToken,
  getAdminRefreshToken,
} from "@/lib/auth/cookies"
import { backendFetch } from "@/lib/api/backend-client"

export async function POST() {
  try {
    const accessToken = await getAdminAccessToken()
    const refreshToken = await getAdminRefreshToken()

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

    return clearAdminAuthCookies(
      NextResponse.json({
        success: true,
        message: "Đăng xuất thành công",
      })
    )
  } catch (error) {
    console.error("Admin logout route error:", error)
    return clearAdminAuthCookies(
      NextResponse.json(
        { message: "Không thể đăng xuất ở thời điểm hiện tại" },
        { status: 500 }
      )
    )
  }
}
