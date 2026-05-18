import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { env, isProduction } from "@/lib/constants/env"

export const ADMIN_ACCESS_TOKEN_COOKIE_NAME = "admin_access_token"
export const ADMIN_REFRESH_TOKEN_COOKIE_NAME = "admin_refresh_token"

const cookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
}

export const adminAccessTokenCookieOptions = {
  ...cookieBaseOptions,
  maxAge: env.adminAccessTokenTtlSeconds,
}

export const adminRefreshTokenCookieOptions = {
  ...cookieBaseOptions,
  maxAge: env.adminRefreshTokenTtlSeconds,
}

export const setAdminAccessTokenCookie = (
  response: NextResponse,
  token: string
) => {
  response.cookies.set(
    ADMIN_ACCESS_TOKEN_COOKIE_NAME,
    token,
    adminAccessTokenCookieOptions
  )
  return response
}

export const setAdminRefreshTokenCookie = (
  response: NextResponse,
  token: string
) => {
  response.cookies.set(
    ADMIN_REFRESH_TOKEN_COOKIE_NAME,
    token,
    adminRefreshTokenCookieOptions
  )
  return response
}

export const clearAdminAuthCookies = (response: NextResponse) => {
  response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE_NAME, "", {
    ...adminAccessTokenCookieOptions,
    maxAge: 0,
  })
  response.cookies.set(ADMIN_REFRESH_TOKEN_COOKIE_NAME, "", {
    ...adminRefreshTokenCookieOptions,
    maxAge: 0,
  })
  return response
}

export const getAdminAccessToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE_NAME)?.value
}

export const getAdminRefreshToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_REFRESH_TOKEN_COOKIE_NAME)?.value
}
