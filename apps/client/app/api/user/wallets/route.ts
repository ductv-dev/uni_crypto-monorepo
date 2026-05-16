import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const DEFAULT_API_URL = "http://localhost:8080"

const getApiBaseUrl = () =>
  (process.env.API_URL || DEFAULT_API_URL).trim().replace(/\/$/, "")

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const apiResponse = await fetch(`${getApiBaseUrl()}/my-wallet`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch wallets" },
        { status: apiResponse.status }
      )
    }

    const userData = await apiResponse.json()
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error in /api/user/wallets GET:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const apiResponse = await fetch(`${getApiBaseUrl()}/my-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    const result = await apiResponse.json().catch(() => null)

    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: result?.message || "Failed to create wallet" },
        { status: apiResponse.status }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in /api/user/wallets POST:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
