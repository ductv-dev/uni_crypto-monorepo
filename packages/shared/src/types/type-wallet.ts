import { TToken } from "./type-token"

export type TTokenBalance = {
  symbol: TToken["symbol"]
  name: TToken["name"]
  logoURI: TToken["logoURI"]
  amount: number // số lượng token nắm giữ
  usdValue: number // giá trị quy đổi sang USDT
}

export type TWallet = {
  address: string // địa chỉ ví (mô phỏng)
  name: string // tên ví do user đặt
  balanceUSDT: number // tổng số dư USDT
  tokens: TTokenBalance[]
}
