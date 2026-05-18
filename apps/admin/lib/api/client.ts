type ApiRequestOptions = RequestInit & {
  defaultErrorMessage: string
}

export const requestJson = async <T>(
  input: RequestInfo | URL,
  options: ApiRequestOptions
): Promise<T> => {
  const { defaultErrorMessage, headers, ...init } = options

  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...init,
  })

  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(responseBody?.message || defaultErrorMessage)
  }

  return responseBody as T
}
