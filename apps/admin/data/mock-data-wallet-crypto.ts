type SystemWallet = {
  id: string
  asset: string
  type: "hot" | "cold" | "treasury" | "fee"
  balance: number
  status: "active" | "maintenance"
  updated_at: string
}
export const SYSTEM_WALLETS: SystemWallet[] = [
  {
    id: "w1",
    asset: "USDT",
    type: "hot",
    balance: 50000,
    status: "active",
    updated_at: "2026-04-22T10:00:00Z",
  },
  {
    id: "w2",
    asset: "USDT",
    type: "cold",
    balance: 200000,
    status: "active",
    updated_at: "2026-04-22T10:00:00Z",
  },
  {
    id: "w3",
    asset: "USDT",
    type: "treasury",
    balance: 15000,
    status: "active",
    updated_at: "2026-04-22T10:00:00Z",
  },
  {
    id: "w4",
    asset: "USDT",
    type: "fee",
    balance: 3200,
    status: "active",
    updated_at: "2026-04-22T10:00:00Z",
  },

  {
    id: "w5",
    asset: "BTC",
    type: "hot",
    balance: 2.5,
    status: "active",
    updated_at: "2026-04-22T10:00:00Z",
  },
  {
    id: "w6",
    asset: "BTC",
    type: "cold",
    balance: 15,
    status: "active",
    updated_at: "2026-04-22T10:00:00Z",
  },
  {
    id: "w7",
    asset: "BTC",
    type: "treasury",
    balance: 1.2,
    status: "active",
    updated_at: "2026-04-22T10:00:00Z",
  },
]
