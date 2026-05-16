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

    const apiResponse = await fetch(`${getApiBaseUrl()}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user data" },
        { status: apiResponse.status }
      )
    }

    const userData = await apiResponse.json()
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error in /api/me:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
