import { FEE_CONFIGS, type TFeeConfig } from "@/data/mock-data-fee"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export const FEE_CONFIGS_QUERY_KEY = ["fee-configs"]

const getFeeConfigs = async (): Promise<TFeeConfig[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  return FEE_CONFIGS
}

export const useFeeConfigs = (): UseQueryResult<TFeeConfig[], Error> => {
  return useQuery({
    queryKey: FEE_CONFIGS_QUERY_KEY,
    queryFn: () => getFeeConfigs(),
    staleTime: 1000 * 60 * 5,
  })
}
