import { NextRequest, NextResponse } from "next/server"

const AUTH_ROUTES = new Set(["/login", "/register"])
const PUBLIC_ROUTES = new Set(["/welcome", "/wellcome"])
const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard"
const LOGIN_ROUTE = "/login"

const isRouteMatch = (pathname: string, routes: Set<string>) =>
  routes.has(pathname)

const isSafeRedirectPath = (pathname: string | null) =>
  Boolean(pathname && pathname.startsWith("/") && !pathname.startsWith("//"))

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const accessToken = req.cookies.get("admin_access_token")?.value
  const isAuthenticated = Boolean(accessToken)
  const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES)
  const isPublicRoute = isRouteMatch(pathname, PUBLIC_ROUTES)

  if (isAuthRoute && isAuthenticated) {
    const nextPath = searchParams.get("next")
    const redirectPath = isSafeRedirectPath(nextPath)
      ? nextPath!
      : DEFAULT_AUTHENTICATED_REDIRECT

    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  if (!isAuthenticated && !isAuthRoute && !isPublicRoute) {
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
