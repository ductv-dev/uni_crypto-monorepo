import { NextRequest, NextResponse } from "next/server"
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  clearAuthCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/lib/auth/cookies"
import { refreshAccessToken } from "@/lib/auth/session"
import { isJwtExpired } from "@/lib/auth/tokens"
import {
  AUTH_ROUTES,
  DEFAULT_AUTHENTICATED_REDIRECT,
  LOGIN_ROUTE,
  PROTECTED_ROUTE_PREFIXES,
  PUBLIC_ROUTES,
} from "@/lib/constants/routes"
import { getSafeRedirectPath } from "@/lib/utils/safe-redirect"

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTE_PREFIXES.some((route) => {
    if (route === "/user") {
      return pathname.startsWith("/user")
    }

    return pathname === route || pathname.startsWith(`${route}/`)
  })

const applyRefreshedCookies = (
  response: NextResponse,
  refreshedAccessToken?: string | null,
  refreshedRefreshToken?: string | null
) => {
  if (refreshedAccessToken) {
    setAccessTokenCookie(response, refreshedAccessToken)
  }

  if (refreshedRefreshToken) {
    setRefreshTokenCookie(response, refreshedRefreshToken)
  }

  return response
}

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const isAuthRoute = AUTH_ROUTES.has(pathname)
  const isPublicRoute = PUBLIC_ROUTES.has(pathname)
  const isPrivateRoute = isProtectedRoute(pathname) && !isPublicRoute

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value

  let isAuthenticated = false
  let shouldClearCookies = false
  let refreshedAccessToken: string | null = null
  let refreshedRefreshToken: string | null = null

  if (accessToken && !isJwtExpired(accessToken)) {
    isAuthenticated = true
  } else if (refreshToken) {
    const refreshedTokens = await refreshAccessToken(refreshToken)
    if (refreshedTokens) {
      isAuthenticated = true
      refreshedAccessToken = refreshedTokens.accessToken
      refreshedRefreshToken = refreshedTokens.refreshToken || null
    } else {
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
      clearAuthCookies(response)
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
      clearAuthCookies(response)
    }
    return response
  }

  const response = NextResponse.next()
  applyRefreshedCookies(response, refreshedAccessToken, refreshedRefreshToken)
  if (shouldClearCookies) {
    clearAuthCookies(response)
  }
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|webmanifest)$).*)",
  ],
}
