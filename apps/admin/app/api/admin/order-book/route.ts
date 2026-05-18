import { NextRequest } from "next/server"
import { getAdminAccessToken, getAdminRefreshToken } from "@/lib/auth/cookies"
import { proxyBackendRequest } from "@/lib/api/proxy-request"

export async function GET(req: NextRequest) {
  const accessToken = await getAdminAccessToken()
  const refreshToken = await getAdminRefreshToken()

  return proxyBackendRequest({
    method: "GET",
    path: "/admin/order-book",
    search: req.nextUrl.search,
    accessToken,
    refreshToken,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
