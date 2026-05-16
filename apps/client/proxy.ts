import { NextRequest, NextResponse } from "next/server"

const AUTH_ROUTES = new Set(["/login", "/register"])
const PROTECTED_ROUTES = new Set([
  "/user",
  "/add-wallet",
  "/create-wallet",
  "/token",
])
const DEFAULT_AUTHENTICATED_REDIRECT = "/user/home"
const LOGIN_ROUTE = "/login"

const isRouteMatch = (pathname: string, routes: Set<string>) => {
  return Array.from(routes).some((route) => {
    if (route === "/user") {
      return pathname.startsWith("/user")
    }
    return pathname === route || pathname.startsWith(route + "/")
  })
}

const isSafeRedirectPath = (pathname: string | null) =>
  Boolean(pathname && pathname.startsWith("/") && !pathname.startsWith("//"))

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const accessToken = req.cookies.get("access_token")?.value
  const refreshToken = req.cookies.get("refresh_token")?.value

  let isAuthenticated = Boolean(accessToken)

  // Nếu AT hết hạn nhưng vẫn còn RT -> Thử refresh token
  if (!isAuthenticated && refreshToken) {
    try {
      // Lưu ý:apps/client có thể cần cấu hình API_URL trong .env
      const apiUrl = process.env.API_URL || "http://localhost:8080"
      const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })

      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        const newAccessToken = data.access_token

        if (newAccessToken) {
          isAuthenticated = true
          // Tạo response và set cookie mới
          const res = NextResponse.next()
          const isProduction = process.env.NODE_ENV === "production"

          res.cookies.set("access_token", newAccessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
            path: "/",
            maxAge: 60 * 15,
          })

          const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES)
          const isProtectedRoute = isRouteMatch(pathname, PROTECTED_ROUTES)

          if (isProtectedRoute && !isAuthRoute) {
            return res
          }
        }
      }
    } catch (error) {
      console.error("Failed to refresh client token:", error)
    }
  }

  const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES)
  const isProtectedRoute = isRouteMatch(pathname, PROTECTED_ROUTES)

  if (isAuthRoute && isAuthenticated) {
    const nextPath = searchParams.get("next")
    const redirectPath = isSafeRedirectPath(nextPath)
      ? nextPath!
      : DEFAULT_AUTHENTICATED_REDIRECT

    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_ROUTE, req.url)
    const nextPath = `${pathname}${req.nextUrl.search}`

    if (pathname !== LOGIN_ROUTE) {
      loginUrl.searchParams.set("next", nextPath)
    }

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
}
