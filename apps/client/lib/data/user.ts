import { api } from "@/lib/api/api"
import { TUser } from "@workspace/shared/types"

/**
 * Fetch current user and their wallets from backend
 */
export async function fetchCurrentUser(): Promise<TUser> {
  const [userData, wallets] = await Promise.all([api.getMe(), api.getWallets()])

  return {
    id: userData.id,
    name: userData.info?.first_name
      ? `${userData.info.first_name} ${userData.info.last_name || ""}`.trim()
      : userData.email,
    email: userData.email,
    phone: userData.info?.phone_number || "",
    avatar: userData.info?.avatar || "",
    wallet: wallets.map((w: any) => ({
      id: w.id,
      name: w.asset?.name ? `Ví ${w.asset.name}` : "Ví cá nhân",
      address: w.id.slice(0, 10),
      balanceUSDT: Number(w.available_balance || 0),
      tokens: [
        {
          symbol: w.asset?.symbol || "TOKEN",
          name: w.asset?.name || "Token Name",
          amount: Number(w.available_balance || 0),
          usdValue: 1, // Tạm thời giả định 1:1 cho USDT/Asset
          logoURI: w.asset?.logo_url || "",
        },
      ],
    })),
  }
}

/**
 * Update user profile
 */
export async function updateUser(data: Partial<TUser>): Promise<TUser> {
  const currentUser = await fetchCurrentUser()
  return {
    ...currentUser,
    ...data,
  }
}
