const DEFAULT_BACKEND_API_URL = "http://localhost:8080"

const normalizeBaseUrl = (value: string) => value.trim().replace(/\/$/, "")

const resolveBackendApiUrl = () => {
  const rawApiUrl = process.env.API_URL?.trim()

  if (rawApiUrl) {
    return normalizeBaseUrl(rawApiUrl)
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing required environment variable: API_URL")
  }

  return DEFAULT_BACKEND_API_URL
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  backendApiUrl: resolveBackendApiUrl(),
  accessTokenTtlSeconds: 60 * 15,
  refreshTokenTtlSeconds: 60 * 60 * 24 * 7,
}

export const isProduction = env.nodeEnv === "production"
