import { getCurrentUser } from "@/lib/api/users"
import { getUserWallets, type BackendWallet } from "@/lib/api/wallets"
import { TUser } from "@workspace/shared/types"

const toNumber = (value: number | string | null | undefined) => {
  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) ? parsedValue : 0
  }

  return 0
}

const mapWalletForUserProfile = (wallet: BackendWallet) => ({
  address: wallet.id,
  name: wallet.asset?.name ? `Ví ${wallet.asset.name}` : "Ví cá nhân",
  balanceUSDT: toNumber(wallet.available_balance),
  tokens: [
    {
      symbol: wallet.asset?.symbol || "TOKEN",
      name: wallet.asset?.name || "Token Name",
      amount: toNumber(wallet.available_balance),
      usdValue: 1,
      logoURI: wallet.asset?.logo_url || "",
    },
  ],
})

export async function fetchCurrentUserProfile(): Promise<TUser> {
  const [userData, wallets] = await Promise.all([
    getCurrentUser(),
    getUserWallets(),
  ])

  return {
    id: userData.id,
    name: userData.info?.first_name
      ? `${userData.info.first_name} ${userData.info.last_name || ""}`.trim()
      : userData.email,
    email: userData.email,
    phone: userData.info?.phone_number || "",
    avatar: userData.info?.avatar || "",
    wallet: wallets.map(mapWalletForUserProfile),
  }
}

export async function updateUserProfile(data: Partial<TUser>): Promise<TUser> {
  const currentUser = await fetchCurrentUserProfile()

  return {
    ...currentUser,
    ...data,
  }
}
