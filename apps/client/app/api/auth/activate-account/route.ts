import { TActivateAccountSchema } from "@workspace/shared"
import { NextResponse } from "next/server"

const DEFAULT_API_URL = "http://localhost:8080"

const getApiBaseUrl = () =>
  (process.env.API_URL || DEFAULT_API_URL).trim().replace(/\/$/, "")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, email } = body as { token: string; email: string }
    const parsedBody = TActivateAccountSchema.safeParse({ hash: token, email })

    if (!token || !email) {
      return NextResponse.json(
        { message: "Dữ liệu không hợp lệ" },
        { status: 400 }
      )
    }
    const apiResponse = await fetch(
      `${getApiBaseUrl()}/auth/activate-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedBody.data),
      }
    )
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
              : "Kích hoạt tài khoản thất bại",
        },
        { status: apiResponse.status }
      )
    }

    return NextResponse.json({ message: "Kích hoạt tài khoản thành công" })
  } catch (error) {
    console.error("Error activating account:", error)
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi kích hoạt tài khoản" },
      { status: 500 }
    )
  }
}
