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

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const accessToken = req.cookies.get("access_token")?.value
  const isAuthenticated = Boolean(accessToken)
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
