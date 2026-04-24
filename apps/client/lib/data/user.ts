/**
 * User data layer
 * Có thể thay trực tiếp bằng API thật mà không cần sửa component UI.
 */

import { MOCK_USER } from "@/data/mock-user"
import { TUser } from "@workspace/shared/types"

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const cloneUser = (user: TUser): TUser => ({
  ...user,
  wallet: user.wallet?.map((wallet) => ({
    ...wallet,
    tokens: wallet.tokens.map((token) => ({ ...token })),
  })),
})

let currentUser: TUser = cloneUser(MOCK_USER)

/**
 * Fetch current user
 * MIGRATION: thay bằng apiClient.user.current() khi backend sẵn sàng.
 */
export async function fetchCurrentUser(): Promise<TUser> {
  await wait(300)

  return cloneUser(currentUser)
}

/**
 * Update user profile
 * MIGRATION: thay bằng apiClient.user.update(payload).
 */
export async function updateUser(data: Partial<TUser>): Promise<TUser> {
  await wait(300)

  currentUser = cloneUser({
    ...currentUser,
    ...data,
  })

  return cloneUser(currentUser)
}
