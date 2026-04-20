export type TToken = {
  name: string
  symbol: string
  address: string
  decimals: number
  logoURI: string
  usdt: number
  isTradingEnabled?: boolean
  isWithdrawEnabled?: boolean
  isDepositEnabled?: boolean
  number_changes?: number
}
