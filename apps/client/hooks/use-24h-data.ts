import { useQuery } from "@tanstack/react-query"

export type DataPoint = {
  time: number
  open: number
  high: number
  low: number
  close: number
  value: number
}

export type Use24hDataResult = {
  data: DataPoint[]
  currentPrice: number
  percentPriceChange: number
}

function calculatePriceMetrics(formattedData: DataPoint[]) {
  if (formattedData.length === 0) {
    return { currentPrice: 0, percentPriceChange: 0 }
  }

  const firstKline = formattedData[0]!
  const lastKline = formattedData[formattedData.length - 1]!

  const cPrice = lastKline.close
  const oPrice = firstKline.open

  return {
    currentPrice: cPrice,
    percentPriceChange: oPrice > 0 ? ((cPrice - oPrice) / oPrice) * 100 : 0,
  }
}

async function fetch24hDataFromBinance(
  symbol: string
): Promise<Use24hDataResult> {
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1h&limit=24`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch 24h data")
  }

  const resData = await response.json()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedData = resData.map((d: any[]) => ({
    time: d[0],
    open: parseFloat(d[1]),
    high: parseFloat(d[2]),
    low: parseFloat(d[3]),
    close: parseFloat(d[4]),
    value: parseFloat(d[4]),
  }))

  const { currentPrice, percentPriceChange } =
    calculatePriceMetrics(formattedData)

  return { data: formattedData, currentPrice, percentPriceChange }
}

export function use24hData(symbol: string) {
  return useQuery({
    queryKey: ["24h-data", symbol],
    queryFn: () => fetch24hDataFromBinance(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
  })
}
