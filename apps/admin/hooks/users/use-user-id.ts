import { useQuery } from "@tanstack/react-query"

import { LIST_USER } from "@/data/mock-data-user"
import { LIST_USER_WALLET } from "@/data/mock-data-user-wallet"
import { MOCK_DEPOSITS } from "@/data/transactions/mock-data-deposit"
import { MOCK_ORDERS } from "@/data/transactions/mock-data-orders"
import { MOCK_WITHDRAWALS } from "@/data/transactions/mock-data-withdraw"
import { TDeposits } from "@/types/transactions/deposits.type"
import { EOrderType, TOrderBook } from "@/types/transactions/order-book.type"
import { TWithdrawals } from "@/types/transactions/withdrawal.type"
import { TUser, TUserWallet } from "@/types/user.type"

export type TDataUserResponse = {
  info: TUser
  wallets: TUserWallet[]
  transactions: {
    deposit: TDeposits[]
    withdrawal: TWithdrawals[]
    buy: TOrderBook[]
    sell: TOrderBook[]
  }
}

const getUserById = async (id: string): Promise<TDataUserResponse | null> => {
  // Tìm kiếm thông tin người dùng từ danh sách mock
  const info = LIST_USER.find((user) => user.id === id)

  if (!info) {
    return null
  }

  // Chuyển đổi id sang number để khớp với user_id trong các bảng giao dịch (nếu cần)
  const userIdNum = parseInt(id)

  // Lấy danh sách ví của người dùng
  const wallets = LIST_USER_WALLET.filter((wallet) => wallet.userId === id)

  // Lấy các giao dịch liên quan
  const deposit = MOCK_DEPOSITS.filter(
    (transaction) => transaction.user_id === userIdNum
  )
  const withdrawal = MOCK_WITHDRAWALS.filter(
    (transaction) => transaction.user_id === userIdNum
  )
  const buy = MOCK_ORDERS.filter(
    (transaction) =>
      transaction.user_id === userIdNum && transaction.type === EOrderType.BUY
  )
  const sell = MOCK_ORDERS.filter(
    (transaction) =>
      transaction.user_id === userIdNum && transaction.type === EOrderType.SELL
  )

  return {
    info,
    wallets,
    transactions: {
      deposit,
      withdrawal,
      buy,
      sell,
    },
  }
}

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user-detail", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 phút
  })
}
