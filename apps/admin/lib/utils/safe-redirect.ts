export const isSafeRedirectPath = (pathname: string | null) =>
  Boolean(pathname && pathname.startsWith("/") && !pathname.startsWith("//"))

export const getSafeRedirectPath = (
  pathname: string | null,
  fallbackPath: string
) => (isSafeRedirectPath(pathname) ? pathname! : fallbackPath)
