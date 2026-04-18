import { fetchTransaction, fetchTransactions } from "@/lib/data/transactions"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { TTransaction } from "@workspace/shared/types"

const TRANSACTIONS_QUERY_KEY = ["transactions"]

export const useTransactions = (): UseQueryResult<TTransaction[], Error> => {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: fetchTransactions,
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
  })
}

/** Lấy dữ liệu một giao dịch theo ID */
export const useTransaction = (
  id: string
): UseQueryResult<TTransaction | null, Error> => {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, id],
    queryFn: () => fetchTransaction(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10, // 10 phút
    gcTime: 1000 * 60 * 15, // 15 phút
  })
}
