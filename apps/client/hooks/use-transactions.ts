import { getUserHistory, type BackendHistoryItem } from "@/lib/api/history"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

const TRANSACTIONS_QUERY_KEY = ["transactions"]

export const useTransactions = (): UseQueryResult<
  BackendHistoryItem[],
  Error
> => {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await getUserHistory()
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
  })
}

/** Lấy dữ liệu một giao dịch theo ID */
export const useTransaction = (
  id: string
): UseQueryResult<BackendHistoryItem | null, Error> => {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getUserHistory()
      return response.data.find((item) => item.id === id) || null
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10, // 10 phút
    gcTime: 1000 * 60 * 15, // 15 phút
  })
}
