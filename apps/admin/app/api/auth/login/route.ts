import { LoginSchema } from "@workspace/shared/schemas"
import { NextResponse } from "next/server"
import { getAdminAppRole } from "@/lib/auth/admin-access"
import {
  setAdminAccessTokenCookie,
  setAdminRefreshTokenCookie,
} from "@/lib/auth/cookies"
import {
  backendFetch,
  normalizeAuthTokens,
  type ApiErrorResponse,
  type BackendAuthResponse,
} from "@/lib/api/backend-client"
import { type BackendAdminUser } from "@/lib/api/users"

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

    const backendLoginResponse = await backendFetch("/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBody.data),
    })

    const backendLoginBody = (await backendLoginResponse
      .json()
      .catch(() => null)) as BackendAuthResponse | ApiErrorResponse | null

    if (!backendLoginResponse.ok) {
      return NextResponse.json(
        {
          message: getErrorMessage(
            backendLoginBody as ApiErrorResponse,
            "Đăng nhập thất bại"
          ),
        },
        { status: backendLoginResponse.status }
      )
    }

    const tokens = normalizeAuthTokens(backendLoginBody as BackendAuthResponse)
    if (!tokens.accessToken || !tokens.refreshToken) {
      return NextResponse.json(
        { message: "API đăng nhập trả về dữ liệu không hợp lệ" },
        { status: 502 }
      )
    }

    // Verify lại profile để chặn sớm tài khoản không thuộc admin UX.
    const meResponse = await backendFetch("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })

    const meBody = (await meResponse.json().catch(() => null)) as
      | BackendAdminUser
      | ApiErrorResponse
      | null

    if (!meResponse.ok) {
      return NextResponse.json(
        {
          message: getErrorMessage(
            meBody as ApiErrorResponse,
            "Không thể xác thực tài khoản admin"
          ),
        },
        { status: meResponse.status }
      )
    }

    const adminRole = getAdminAppRole(meBody as BackendAdminUser)
    if (!adminRole) {
      return NextResponse.json(
        { message: "Tài khoản này không có quyền truy cập trang admin" },
        { status: 403 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: {
        email: parsedBody.data.email,
        role: adminRole,
      },
    })

    setAdminAccessTokenCookie(response, tokens.accessToken)
    setAdminRefreshTokenCookie(response, tokens.refreshToken)
    return response
  } catch (error) {
    console.error("Admin login route error:", error)
    return NextResponse.json(
      { message: "Không thể kết nối tới dịch vụ đăng nhập" },
      { status: 500 }
    )
  }
}
