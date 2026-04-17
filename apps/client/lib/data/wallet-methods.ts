/**
 * Wallet methods data layer
 * This function can be replaced with API call without changing the hook
 */

import { Icons } from "@workspace/ui/components/icons"

export type MethodAddWalletType = {
  id: number
  title: string
  description: string
  icon: keyof typeof Icons
}

// Mock data
const MOCK_WALLET_METHODS: MethodAddWalletType[] = [
  {
    id: 1,
    title: "Tạo ví Keyless",
    description: "Tạo ví mới để bắt đầu",
    icon: "wallet2",
  },
  {
    id: 2,
    title: "Nhập ví",
    description: "Nhập ví để bắt đầu",
    icon: "import",
  },
]

/**
 * Fetch available wallet methods
 * MIGRATION: Replace with apiClient.wallets.methods() when API is ready
 */
export async function fetchWalletMethods(): Promise<MethodAddWalletType[]> {
  // Mock: simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_WALLET_METHODS
}
