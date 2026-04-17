/**
 * Centralized API client configuration
 * Use this file to configure API endpoints and base URL
 * Makes it easy to switch from mock to real API later
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const apiClient = {
  baseURL: API_BASE_URL,

  // Will be used for real API calls later
  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  },

  // Token endpoints
  tokens: {
    list: async () => apiClient.fetch("/tokens"),
    get: async (address: string) => apiClient.fetch(`/tokens/${address}`),
  },

  // User endpoints
  user: {
    current: async () => apiClient.fetch("/user/me"),
    update: async (data: any) =>
      apiClient.fetch("/user/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },

  // Transaction endpoints
  transactions: {
    list: async () => apiClient.fetch("/transactions"),
    get: async (id: string) => apiClient.fetch(`/transactions/${id}`),
  },

  // Wallet endpoints
  wallets: {
    methods: async () => apiClient.fetch("/wallets/methods"),
    create: async (data: any) =>
      apiClient.fetch("/wallets", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
}

export type ApiClient = typeof apiClient
