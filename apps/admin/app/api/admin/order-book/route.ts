import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const DEFAULT_API_URL = "http://localhost:8080"

const getApiBaseUrl = () =>
  (process.env.API_URL || DEFAULT_API_URL).trim().replace(/\/$/, "")

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("admin_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const apiResponse = await fetch(
      `${getApiBaseUrl()}/admin/order-book?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch order book" },
        { status: apiResponse.status }
      )
    }

    const data = await apiResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in /api/admin/order-book:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
