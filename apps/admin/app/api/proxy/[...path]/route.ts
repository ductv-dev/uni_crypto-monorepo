import { proxyBackendRequest } from "@/lib/api/proxy-request"
import { getAdminAccessToken, getAdminRefreshToken } from "@/lib/auth/cookies"
import { NextRequest, NextResponse } from "next/server"

const resolveBackendPath = (segments: string[]) => `/${segments.join("/")}`
//
const proxyHandler = async (
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  try {
    const { path } = await params
    if (!path?.length) {
      return NextResponse.json(
        { message: "Invalid proxy path" },
        { status: 400 }
      )
    }

    const accessToken = await getAdminAccessToken()
    const refreshToken = await getAdminRefreshToken()
    const headers = new Headers(req.headers)

    headers.delete("cookie")
    headers.delete("authorization")
    headers.delete("host")
    headers.delete("connection")
    headers.delete("content-length")

    const method = req.method.toUpperCase()
    const body = method === "GET" || method === "HEAD" ? null : await req.text()

    return proxyBackendRequest({
      method,
      path: resolveBackendPath(path),
      search: req.nextUrl.search,
      headers,
      body,
      accessToken,
      refreshToken,
    })
  } catch {
    return NextResponse.json(
      { message: "Backend service unavailable" },
      { status: 503 }
    )
  }
}

export const GET = proxyHandler
export const POST = proxyHandler
export const PUT = proxyHandler
export const PATCH = proxyHandler
export const DELETE = proxyHandler
