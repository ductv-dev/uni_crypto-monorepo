export const AUTH_ROUTES = new Set(["/login", "/register"])
export const PUBLIC_ROUTES = new Set(["/welcome", "/wellcome"])
export const PROTECTED_ROUTE_PREFIXES = [
  "/user",
  "/add-wallet",
  "/create-wallet",
  "/token",
]
export const LOGIN_ROUTE = "/login"
export const DEFAULT_AUTHENTICATED_REDIRECT = "/user/home"
