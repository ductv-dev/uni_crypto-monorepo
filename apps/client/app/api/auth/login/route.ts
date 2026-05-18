import { LoginSchema } from "@workspace/shared/schemas"
import { NextResponse } from "next/server"
import {
  backendFetch,
  normalizeAuthTokens,
  type ApiErrorResponse,
  type BackendAuthResponse,
} from "@/lib/api/backend-client"
import { setAccessTokenCookie, setRefreshTokenCookie } from "@/lib/auth/cookies"

const getErrorMessage = (payload: ApiErrorResponse | null, fallback: string) =>
  typeof payload?.message === "string" ? payload.message : fallback

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

    const apiResponse = await backendFetch("/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBody.data),
    })

    const responseBody = (await apiResponse.json().catch(() => null)) as
      | BackendAuthResponse
      | ApiErrorResponse
      | null

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          message: getErrorMessage(
            responseBody as ApiErrorResponse,
            "Đăng nhập thất bại"
          ),
        },
        { status: apiResponse.status }
      )
    }

    const tokens = normalizeAuthTokens(responseBody as BackendAuthResponse)

    if (!tokens.accessToken || !tokens.refreshToken) {
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

    setAccessTokenCookie(response, tokens.accessToken)
    setRefreshTokenCookie(response, tokens.refreshToken)
    return response
  } catch (error) {
    console.error("Client login route error:", error)
    return NextResponse.json(
      { message: "Không thể kết nối tới dịch vụ đăng nhập" },
      { status: 500 }
    )
  }
}
