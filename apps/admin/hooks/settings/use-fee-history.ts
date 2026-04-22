import { FEE_RECORDS, type TFeeRecord } from "@/data/mock-data-fee"
import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query"

export const FEE_HISTORY_QUERY_KEY = ["fee-history"]

export type TFeeHistoryFilters = {
  feeType?: TFeeRecord["feeType"]
  asset?: string
}

export type TFeeHistoryResponse = {
  data: TFeeRecord[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

const getFeeHistory = async (
  limit: number,
  offset: number,
  search?: string,
  filters?: TFeeHistoryFilters
): Promise<TFeeHistoryResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredRecords = [...FEE_RECORDS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (filters?.feeType) {
    filteredRecords = filteredRecords.filter(
      (record) => record.feeType === filters.feeType
    )
  }

  if (filters?.asset) {
    filteredRecords = filteredRecords.filter(
      (record) => record.asset === filters.asset
    )
  }

  if (search) {
    const normalizedSearch = search.trim().toLowerCase()
    filteredRecords = filteredRecords.filter((record) =>
      [
        record.userId,
        record.referenceId,
        record.referenceType,
        record.asset,
        record.feeType,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    )
  }

  const paginatedRecords = filteredRecords.slice(offset, offset + limit)

  return {
    data: paginatedRecords,
    pagination: {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: filteredRecords.length,
      totalPages: Math.ceil(filteredRecords.length / limit),
      hasNextPage: offset + limit < filteredRecords.length,
      hasPrevPage: offset > 0,
    },
  }
}

export const useFeeHistory = (
  limit: number,
  offset: number,
  search?: string,
  filters?: TFeeHistoryFilters
): UseQueryResult<TFeeHistoryResponse, Error> => {
  return useQuery({
    queryKey: [FEE_HISTORY_QUERY_KEY, limit, offset, search, filters],
    queryFn: () => getFeeHistory(limit, offset, search, filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}
