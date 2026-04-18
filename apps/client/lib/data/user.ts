/**
 * User data layer
 * This function can be replaced with API call without changing the hook
 */

import { TUser } from "@workspace/shared/types"

// Mock data
const MOCK_USER: TUser = {
  name: "Account",
  id: "0x1234567890abcdef",
  avatar: "",
  email: "example@gmail.com",
  wallet: [
    {
      address: "0x1234567890abc2def",
      name: "Wallet 1",
      balanceUSDT: 100,
      tokens: [
        {
          symbol: "ETH",
          name: "Ethereum",
          logoURI:
            "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696506040",
          amount: 1,
          usdValue: 100,
        },
        {
          symbol: "USDT",
          name: "Tether",
          logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png",
          amount: 100,
          usdValue: 100,
        },
        {
          symbol: "BTC",
          name: "Bitcoin",
          logoURI:
            "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696506040",
          amount: 1,
          usdValue: 100,
        },
      ],
    },
    {
      address: "0x1234567890abcedef",
      name: "Wallet 2",
      balanceUSDT: 100,
      tokens: [
        {
          symbol: "ETH",
          name: "Ethereum",
          logoURI:
            "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696506040",
          amount: 44,
          usdValue: 100,
        },
        {
          symbol: "USDT",
          name: "Tether",
          logoURI:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png",
          amount: 32,
          usdValue: 100,
        },
        {
          symbol: "BTC",
          name: "Bitcoin",
          logoURI:
            "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696506040",
          amount: 11,
          usdValue: 100,
        },
      ],
    },
  ],
}

/**
 * Fetch current user
 * MIGRATION: Replace with apiClient.user.current() when API is ready
 */
export async function fetchCurrentUser(): Promise<TUser> {
  // Mock: simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_USER
}

/**
 * Update user profile
 */
export async function updateUser(data: Partial<TUser>): Promise<TUser> {
  // Mock: return updated user
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { ...MOCK_USER, ...data }
}
