import { NextRequest, NextResponse } from "next/server"
import {
  ADMIN_ACCESS_TOKEN_COOKIE_NAME,
  ADMIN_REFRESH_TOKEN_COOKIE_NAME,
  clearAdminAuthCookies,
  setAdminAccessTokenCookie,
  setAdminRefreshTokenCookie,
} from "@/lib/auth/cookies"
import { isJwtExpired } from "@/lib/auth/tokens"
import { refreshAdminAccessToken } from "@/lib/auth/session"
import {
  AUTH_ROUTES,
  DEFAULT_AUTHENTICATED_REDIRECT,
  LOGIN_ROUTE,
  PUBLIC_ROUTES,
} from "@/lib/constants/routes"
import { getSafeRedirectPath } from "@/lib/utils/safe-redirect"

const isRouteMatch = (pathname: string, routes: Set<string>) =>
  routes.has(pathname)

const applyRefreshedCookies = (
  response: NextResponse,
  refreshedAccessToken?: string | null,
  refreshedRefreshToken?: string | null
) => {
  if (refreshedAccessToken) {
    setAdminAccessTokenCookie(response, refreshedAccessToken)
  }

  if (refreshedRefreshToken) {
    setAdminRefreshTokenCookie(response, refreshedRefreshToken)
  }

  return response
}

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES)
  const isPublicRoute = isRouteMatch(pathname, PUBLIC_ROUTES)
  const isPrivateRoute = !isAuthRoute && !isPublicRoute

  const accessToken = req.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE_NAME)?.value
  const refreshToken = req.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE_NAME)?.value

  let isAuthenticated = false
  let shouldClearCookies = false
  let refreshedAccessToken: string | null = null
  let refreshedRefreshToken: string | null = null

  if (accessToken && !isJwtExpired(accessToken)) {
    isAuthenticated = true
  } else if (refreshToken) {
    try {
      // Middleware chỉ làm "nhẹ": refresh theo exp, không gọi /auth/me để verify profile.
      const refreshedTokens = await refreshAdminAccessToken(refreshToken)
      if (refreshedTokens) {
        isAuthenticated = true
        refreshedAccessToken = refreshedTokens.accessToken
        refreshedRefreshToken = refreshedTokens.refreshToken || null
      } else {
        shouldClearCookies = true
      }
    } catch (error) {
      console.error("Failed to refresh admin token in proxy:", error)
      shouldClearCookies = true
    }
  }

  if (isAuthRoute && isAuthenticated) {
    const redirectPath = getSafeRedirectPath(
      searchParams.get("next"),
      DEFAULT_AUTHENTICATED_REDIRECT
    )
    const response = NextResponse.redirect(new URL(redirectPath, req.url))
    applyRefreshedCookies(response, refreshedAccessToken, refreshedRefreshToken)
    if (shouldClearCookies) {
      clearAdminAuthCookies(response)
    }
    return response
  }

  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_ROUTE, req.url)
    if (pathname !== LOGIN_ROUTE) {
      loginUrl.searchParams.set("next", `${pathname}${req.nextUrl.search}`)
    }

    const response = NextResponse.redirect(loginUrl)
    if (shouldClearCookies) {
      clearAdminAuthCookies(response)
    }
    return response
  }

  const response = NextResponse.next()
  applyRefreshedCookies(response, refreshedAccessToken, refreshedRefreshToken)
  if (shouldClearCookies) {
    clearAdminAuthCookies(response)
  }
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|webmanifest)$).*)",
  ],
}
