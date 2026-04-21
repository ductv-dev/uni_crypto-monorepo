import { MOCK_TRANSACTIONS } from "@/data/mock-data-transactions"
import {
  ERiskLevel,
  ETransactionStatus,
  ETransactionType,
  TTransaction,
} from "@/types/transaction.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const TRANSACTION_LIST_QUERY_KEY = ["transaction-list"]

export type TFilters = {
  type?: ETransactionType
  status?: ETransactionStatus
  riskLevel?: ERiskLevel
}
export type TOverView = {
  title: string
  total: number
  amount: number
  success: number
  failed: number
  processing: number
  rejected: number
}

export const calculateOverview = (
  transactions: TTransaction[]
): TOverView[] => {
  const overview: TOverView[] = [
    {
      title: "deposit",
      total: 0,
      amount: 0,
      success: 0,
      failed: 0,
      processing: 0,
      rejected: 0,
    },
    {
      title: "withdraw",
      total: 0,
      amount: 0,
      success: 0,
      failed: 0,
      processing: 0,
      rejected: 0,
    },
    {
      title: "buy",
      total: 0,
      amount: 0,
      success: 0,
      failed: 0,
      processing: 0,
      rejected: 0,
    },
    {
      title: "sell",
      total: 0,
      amount: 0,
      success: 0,
      failed: 0,
      processing: 0,
      rejected: 0,
    },
  ]

  transactions.forEach((tx) => {
    const target =
      tx.type === ETransactionType.DEPOSIT
        ? overview[0]
        : tx.type === ETransactionType.WITHDRAW
          ? overview[1]
          : tx.type === ETransactionType.BUY
            ? overview[2]
            : tx.type === ETransactionType.SELL
              ? overview[3]
              : null

    if (target) {
      target.total += 1
      target.amount += parseFloat(tx.amount)
      if (tx.status === ETransactionStatus.SUCCESS) target.success += 1
      else if (tx.status === ETransactionStatus.FAILED) target.failed += 1
      else if (tx.status === ETransactionStatus.PROCESSING)
        target.processing += 1
      else if (tx.status === ETransactionStatus.REJECTED) target.rejected += 1
    }
  })

  return overview
}

const getTransactionList = async (): Promise<TOverView[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const overview = calculateOverview(MOCK_TRANSACTIONS)

  return overview
}

export const useTransactionsOverview = (): UseQueryResult<
  TOverView[],
  Error
> => {
  return useQuery({
    queryKey: [TRANSACTION_LIST_QUERY_KEY],
    queryFn: () => getTransactionList(),
    staleTime: 1000 * 60 * 5,
  })
}
