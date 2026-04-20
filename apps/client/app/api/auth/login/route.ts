import { LoginSchema } from "@workspace/shared/schemas"
import { NextResponse } from "next/server"

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

    const { email, password } = parsedBody.data

    if (email !== "user@gmail.com" || password !== "12345678") {
      return NextResponse.json(
        { message: "Sai tài khoản hoặc mật khẩu" },
        { status: 401 }
      )
    }

    const mockData = {
      accessToken: "mock_access_token_user_123",
      refreshToken: "mock_refresh_token_user_123",
      user: {
        id: "user_123",
        email: "user@gmail.com",
        name: "User",
      },
    }

    const response = NextResponse.json({
      success: true,
      user: mockData.user,
    })

    const isProduction = process.env.NODE_ENV === "production"

    response.cookies.set("access_token", mockData.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: 60 * 15,
    })

    response.cookies.set("refresh_token", mockData.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}
