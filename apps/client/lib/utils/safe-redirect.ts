export const getSafeRedirectPath = (
  pathname: string | null,
  fallbackPath: string
) => {
  if (!pathname) {
    return fallbackPath
  }

  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    return fallbackPath
  }

  return pathname
}
