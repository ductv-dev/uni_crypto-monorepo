import { proxyBackendRequest } from "@/lib/api/proxy-request"
import { getAccessToken, getRefreshToken } from "@/lib/auth/cookies"

export async function GET() {
  const accessToken = await getAccessToken()
  const refreshToken = await getRefreshToken()

  return proxyBackendRequest({
    method: "GET",
    path: "/auth/me",
    accessToken,
    refreshToken,
  })
}
