export const api = {
  login: async (data: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Login failed")
    }

    return res.json()
  },

  logout: async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    })

    if (!res.ok) throw new Error("Logout failed")

    return res.json()
  },

  getMe: async () => {
    const res = await fetch("/api/me")

    if (!res.ok) throw new Error("Unauthorized")

    return res.json()
  },

  activeAccount: async (data: { token: string; email: string }) => {
    const res = await fetch("/api/auth/activate-account", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Account activation failed")
    }

    return res.json()
  },
}
