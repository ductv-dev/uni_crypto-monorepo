import { TAdmin } from "@/types"
import { create } from "zustand"

type Action = {
  setName: (name: TAdmin["name"]) => void
}

type AdminStore = {
  admin: TAdmin
} & Action

export const useAdmin = create<AdminStore>((set) => ({
  admin: {
    name: "Super Admin",
    avatar: "",
    email: "example@gmail.com",
    phone: "1234567890",
    role: "admin",
    status: "active",
  },
  setName: (name: TAdmin["name"]) =>
    set((state: { admin: TAdmin }) => ({ admin: { ...state.admin, name } })),
}))
