import { LoginSchema } from "@workspace/shared/schemas"
import { NextResponse } from "next/server"

const DEFAULT_API_URL = "http://localhost:8080"

const getApiBaseUrl = () =>
  (process.env.API_URL || DEFAULT_API_URL).trim().replace(/\/$/, "")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedBody = LoginSchema.safeParse(body)

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Dữ liệu không hợp lệ" },
        { status: 400 }
      )
    }

    const apiResponse = await fetch(`${getApiBaseUrl()}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBody.data),
    })

    const responseBody = await apiResponse.json().catch(() => null)

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          message:
            responseBody &&
            typeof responseBody === "object" &&
            "message" in responseBody &&
            typeof responseBody.message === "string"
              ? responseBody.message
              : "Đăng nhập thất bại",
        },
        { status: apiResponse.status }
      )
    }

    const accessToken =
      responseBody &&
      typeof responseBody === "object" &&
      "access_token" in responseBody &&
      typeof responseBody.access_token === "string"
        ? responseBody.access_token
        : null

    const refreshToken =
      responseBody &&
      typeof responseBody === "object" &&
      "refresh_token" in responseBody &&
      typeof responseBody.refresh_token === "string"
        ? responseBody.refresh_token
        : null

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: "API đăng nhập trả về dữ liệu không hợp lệ" },
        { status: 502 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: {
        email: parsedBody.data.email,
      },
    })

    const isProduction = process.env.NODE_ENV === "production"

    response.cookies.set("admin_access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: 60 * 15,
    })

    response.cookies.set("admin_refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Admin login route error:", error)
    return NextResponse.json(
      { message: "Không thể kết nối tới dịch vụ đăng nhập" },
      { status: 500 }
    )
  }
}
