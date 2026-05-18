import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { env, isProduction } from "@/lib/constants/env"

export const ACCESS_TOKEN_COOKIE_NAME = "access_token"
export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token"

const cookieBaseOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
}

export const accessTokenCookieOptions = {
  ...cookieBaseOptions,
  maxAge: env.accessTokenTtlSeconds,
}

export const refreshTokenCookieOptions = {
  ...cookieBaseOptions,
  maxAge: env.refreshTokenTtlSeconds,
}

export const setAccessTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE_NAME,
    token,
    accessTokenCookieOptions
  )
  return response
}

export const setRefreshTokenCookie = (
  response: NextResponse,
  token: string
) => {
  response.cookies.set(
    REFRESH_TOKEN_COOKIE_NAME,
    token,
    refreshTokenCookieOptions
  )
  return response
}

export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    ...accessTokenCookieOptions,
    maxAge: 0,
  })
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    ...refreshTokenCookieOptions,
    maxAge: 0,
  })
  return response
}

export const getAccessToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value
}

export const getRefreshToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value
}
