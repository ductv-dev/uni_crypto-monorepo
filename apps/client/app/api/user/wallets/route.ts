import { proxyBackendRequest } from "@/lib/api/proxy-request"
import { getAccessToken, getRefreshToken } from "@/lib/auth/cookies"

export async function GET(req: Request) {
  const accessToken = await getAccessToken()
  const refreshToken = await getRefreshToken()
  const url = new URL(req.url)

  return proxyBackendRequest({
    method: "GET",
    path: "/my-wallet",
    search: url.search,
    accessToken,
    refreshToken,
  })
}

export async function POST(req: Request) {
  const accessToken = await getAccessToken()
  const refreshToken = await getRefreshToken()

  return proxyBackendRequest({
    method: "POST",
    path: "/my-wallet",
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
    body: await req.text(),
    accessToken,
    refreshToken,
  })
}
