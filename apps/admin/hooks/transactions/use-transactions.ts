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
  startDate?: string
  endDate?: string
  tokenSymbol?: string
  network?: string
  shortBy?: keyof TTransaction
  shortDirection?: "asc" | "desc"
}

type TData = {
  data: TTransaction[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

const getTransactionList = async (
  search?: string,
  filters?: TFilters,
  limit: number = 10,
  offset: number = 0
): Promise<TData> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredTransactions = MOCK_TRANSACTIONS

  if (filters?.type) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.type === filters.type
    )
  }

  if (filters?.status) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.status === filters.status
    )
  }

  if (filters?.riskLevel) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.riskLevel === filters.riskLevel
    )
  }
  if (filters?.tokenSymbol) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.tokenSymbol === filters.tokenSymbol
    )
  }
  if (filters?.network) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.network === filters.network
    )
  }
  // if (filters?.startDate && filters?.endDate) {
  //   filteredTransactions = filteredTransactions.filter(
  //     (tx) =>
  //       new Date(tx.createdAt) >= new Date(filters.startDate) &&
  //       new Date(tx.createdAt) <= new Date(filters.endDate)
  //   )
  // }
  if (search) {
    const normalizedSearch = search.trim().toLowerCase()
    filteredTransactions = filteredTransactions.filter((tx) => {
      const id = tx.id.toLowerCase()
      const userId = tx.userId.toLowerCase()
      const tokenSymbol = tx.tokenSymbol.toLowerCase()
      const type = tx.type.toLowerCase()
      const network = tx.network?.toLowerCase() ?? ""
      const status = tx.status.toLowerCase()
      const txHash = tx.txHash?.toLowerCase() ?? ""
      const fromAddress = tx.fromAddress?.toLowerCase() ?? ""
      const toAddress = tx.toAddress?.toLowerCase() ?? ""
      const approvedBy = tx.approvedBy?.toLowerCase() ?? ""
      const rejectedBy = tx.rejectedBy?.toLowerCase() ?? ""
      const rejectReason = tx.rejectReason?.toLowerCase() ?? ""
      const riskLevel = tx.riskLevel?.toLowerCase() ?? ""

      return (
        id.includes(normalizedSearch) ||
        userId.includes(normalizedSearch) ||
        tokenSymbol.includes(normalizedSearch) ||
        type.includes(normalizedSearch) ||
        network.includes(normalizedSearch) ||
        status.includes(normalizedSearch) ||
        txHash.includes(normalizedSearch) ||
        fromAddress.includes(normalizedSearch) ||
        toAddress.includes(normalizedSearch) ||
        approvedBy.includes(normalizedSearch) ||
        rejectedBy.includes(normalizedSearch) ||
        rejectReason.includes(normalizedSearch) ||
        riskLevel.includes(normalizedSearch)
      )
    })
  }

  const paginatedTransactions = filteredTransactions.slice(
    offset,
    offset + limit
  )

  return {
    data: paginatedTransactions,
    meta: {
      total: filteredTransactions.length,
      page: offset / limit + 1,
      limit,
      totalPages: Math.ceil(filteredTransactions.length / limit),
      hasNextPage: offset + limit < filteredTransactions.length,
      hasPrevPage: offset > 0,
    },
  }
}

export const useTransaction = (
  search?: string,
  filters?: TFilters,
  limit?: number,
  offset?: number
): UseQueryResult<TData, Error> => {
  return useQuery({
    queryKey: [TRANSACTION_LIST_QUERY_KEY, search, filters, limit, offset],
    queryFn: () => getTransactionList(search, filters, limit, offset),
    staleTime: 1000 * 60 * 5,
  })
}
