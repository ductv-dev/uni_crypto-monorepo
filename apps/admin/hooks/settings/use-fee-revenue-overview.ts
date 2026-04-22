import { FEE_RECORDS, type TFeeRecord } from "@/data/mock-data-fee"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const FEE_REVENUE_OVERVIEW_QUERY_KEY = ["fee-revenue-overview"]

type TFeeRevenueBreakdown = {
  label: string
  total: number
}

export type TFeeRevenueOverview = {
  totalTodayRevenue: number
  totalRecordsToday: number
  activeAssetsToday: number
  byAsset: TFeeRevenueBreakdown[]
  byFeeType: TFeeRevenueBreakdown[]
}

const getLatestRecordDate = (records: TFeeRecord[]) => {
  return records.reduce((latest, record) => {
    const recordDate = record.createdAt.slice(0, 10)

    return recordDate > latest ? recordDate : latest
  }, "")
}

export const calculateFeeRevenueOverview = (
  records: TFeeRecord[]
): TFeeRevenueOverview => {
  const latestDate = getLatestRecordDate(records)
  const dailyRecords = records.filter(
    (record) => record.createdAt.slice(0, 10) === latestDate
  )

  const byAssetMap = new Map<string, number>()
  const byFeeTypeMap = new Map<string, number>()

  dailyRecords.forEach((record) => {
    byAssetMap.set(
      record.asset,
      (byAssetMap.get(record.asset) ?? 0) + record.amount
    )
    byFeeTypeMap.set(
      record.feeType,
      (byFeeTypeMap.get(record.feeType) ?? 0) + record.amount
    )
  })

  return {
    totalTodayRevenue: dailyRecords.reduce(
      (total, record) => total + record.amount,
      0
    ),
    totalRecordsToday: dailyRecords.length,
    activeAssetsToday: byAssetMap.size,
    byAsset: Array.from(byAssetMap.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total),
    byFeeType: Array.from(byFeeTypeMap.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total),
  }
}

const getFeeRevenueOverview = async (): Promise<TFeeRevenueOverview> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return calculateFeeRevenueOverview(FEE_RECORDS)
}

export const useFeeRevenueOverview = (): UseQueryResult<
  TFeeRevenueOverview,
  Error
> => {
  return useQuery({
    queryKey: FEE_REVENUE_OVERVIEW_QUERY_KEY,
    queryFn: () => getFeeRevenueOverview(),
    staleTime: 1000 * 60 * 5,
  })
}
