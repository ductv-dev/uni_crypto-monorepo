import { MOCK_USER } from "@/data/mock-user"
import { TUser } from "shared/src/types"
import { create } from "zustand"

export type UserStoreAction = {
  setName: (name: TUser["name"]) => void
}

export type UserStoreState = {
  user: TUser
}

export type UserStore = UserStoreState & UserStoreAction

export const useUser = create<UserStore>((set) => ({
  user: MOCK_USER,
  setName: (name: TUser["name"]) =>
    set((state: { user: TUser }) => ({ user: { ...state.user, name } })),
}))
