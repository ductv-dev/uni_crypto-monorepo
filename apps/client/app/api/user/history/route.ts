import { proxyBackendRequest } from "@/lib/api/proxy-request"
import { getAccessToken, getRefreshToken } from "@/lib/auth/cookies"

export async function GET(req: Request) {
  const accessToken = await getAccessToken()
  const refreshToken = await getRefreshToken()
  const url = new URL(req.url)

  return proxyBackendRequest({
    method: "GET",
    path: "/my-wallet/history",
    search: url.search,
    accessToken,
    refreshToken,
  })
}
