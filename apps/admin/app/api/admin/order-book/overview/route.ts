import { getAdminAccessToken, getAdminRefreshToken } from "@/lib/auth/cookies"
import { proxyBackendRequest } from "@/lib/api/proxy-request"

export async function GET() {
  const accessToken = await getAdminAccessToken()
  const refreshToken = await getAdminRefreshToken()

  return proxyBackendRequest({
    method: "GET",
    path: "/admin/order-book/overview",
    accessToken,
    refreshToken,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
