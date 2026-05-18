export type JwtAccessPayload = {
  sub: string
  sid?: string
  sessionId?: string
  role?: string
  type?: "access"
  exp: number
  iat: number
}

export type JwtRefreshPayload = {
  sub: string
  sid?: string
  sessionId?: string
  type?: "refresh"
  exp: number
  iat: number
}

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  )

  try {
    if (typeof atob === "function") {
      return decodeURIComponent(
        Array.prototype.map
          .call(
            atob(padded),
            (char: string) =>
              `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`
          )
          .join("")
      )
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(padded, "base64").toString("utf8")
    }

    return null
  } catch {
    return null
  }
}

export const decodeJwtPayload = <TPayload = Record<string, unknown>>(
  token: string
): TPayload | null => {
  const parts = token.split(".")
  if (parts.length < 2) {
    return null
  }

  const payloadSegment = parts[1]
  if (!payloadSegment) {
    return null
  }

  const decodedPayload = decodeBase64Url(payloadSegment)
  if (!decodedPayload) {
    return null
  }

  try {
    return JSON.parse(decodedPayload) as TPayload
  } catch {
    return null
  }
}

export const isJwtExpired = (token: string, skewSeconds = 30) => {
  const payload = decodeJwtPayload<{ exp?: number }>(token)

  if (!payload || typeof payload.exp !== "number") {
    return true
  }

  const currentTimestamp = Math.floor(Date.now() / 1000)
  return payload.exp <= currentTimestamp + skewSeconds
}
