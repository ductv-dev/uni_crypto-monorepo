type ApiRequestOptions = RequestInit & {
  defaultErrorMessage: string
}

const normalizeApiErrorMessage = (
  responseBody: unknown,
  fallbackMessage: string
): string => {
  if (!responseBody || typeof responseBody !== "object") {
    return fallbackMessage
  }

  const payload = responseBody as {
    message?: string | string[]
    error?: string
  }

  if (Array.isArray(payload.message)) {
    const joinedMessage = payload.message.filter(Boolean).join(", ").trim()
    return joinedMessage || fallbackMessage
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim()
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error.trim()
  }

  return fallbackMessage
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
    throw new Error(normalizeApiErrorMessage(responseBody, defaultErrorMessage))
  }

  return responseBody as T
}
