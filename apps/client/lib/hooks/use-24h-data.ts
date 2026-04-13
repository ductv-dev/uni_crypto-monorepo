import { useEffect, useState } from "react"

export type DataPoint = {
  time: number
  open: number
  high: number
  low: number
  close: number
  value: number
}

export function use24hData(symbol: string) {
  const [data, setData] = useState<DataPoint[]>([])
  const [currentPrice, setCurrentPrice] = useState(0)
  const [percentPriceChange, setPercentPriceChange] = useState(0)
  const [isLoading, setIsLoading] = useState(!!symbol)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let ignore = false
    const fetch24hData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1h&limit=24`
        )
        if (!response.ok) {
          setError(new Error("HTTP Error"))
        }
        setIsLoading(false)
        const resData = await response.json()
        if (!ignore) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData = resData.map((d: any[]) => ({
            time: d[0],
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
            value: parseFloat(d[4]),
          }))

          setData(formattedData)

          // Tính toán giá hiện tại và % thay đổi giá trong 24h (dựa trên nến đầu và nến cuối)
          if (formattedData.length > 0) {
            const firstKline = formattedData[0]
            const lastKline = formattedData[formattedData.length - 1]

            const cPrice = lastKline.close
            const oPrice = firstKline.open

            setCurrentPrice(cPrice)
            setPercentPriceChange(
              oPrice > 0 ? ((cPrice - oPrice) / oPrice) * 100 : 0
            )
          }
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error fetching 24h data:", err)
        if (!ignore) setIsLoading(false)
      }
    }

    if (symbol) {
      fetch24hData()
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
    }

    return () => {
      ignore = true
    }
  }, [symbol])

  return { data, currentPrice, percentPriceChange, isLoading, error }
}
