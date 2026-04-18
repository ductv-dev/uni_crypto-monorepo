import { NextResponse } from "next/server"

export async function POST() {
  const isProduction = process.env.NODE_ENV === "production"
  // mai mốt gọi api đăng xuất, cập nhật session
  const response = NextResponse.json({
    success: true,
    message: "Đăng xuất thành công",
  })

  response.cookies.set("access_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  })

  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  })

  return response
}
