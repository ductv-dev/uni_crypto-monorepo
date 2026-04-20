"use client"
import { Timeframe } from "@/lib/utils/utils"
import { CandlestickData, HistogramData, Time } from "lightweight-charts"
import { useCallback, useEffect, useRef, useState } from "react"

const INTERVAL_MAP: Record<string, string> = {
  "1S": "1s",
  "1H": "1h",
  "1D": "1d",
  "1W": "1w",
  "1M": "1M",
  "1Y": "1M",
}

/**
 * Hook chuyên biệt quản lý dữ liệu cho Biểu đồ Nến & Volume từ Binance (REST + WebSocket)
 * 1 data + 1 websocket để update giá liên tục
 */
export function useBinanceKline(symbol: string, timeframe: Timeframe) {
  const [historicalData, setHistoricalData] = useState<CandlestickData<Time>[]>(
    []
  )
  const [volumeData, setVolumeData] = useState<HistogramData<Time>[]>([])
  const [isLoadingChart, setIsLoadingChart] = useState(true)
  const [errorChart, setErrorChart] = useState<Error | null>(null)

  // Dùng Ref để lưu trữ callback update trực tiếp vào biểu đồ (không qua React state để tránh re-render)
  const realtimeCallback = useRef<
    | ((candle: CandlestickData<Time>, volume: HistogramData<Time>) => void)
    | null
  >(null)

  const subscribeRealtime = useCallback(
    (
      callback: (
        candle: CandlestickData<Time>,
        volume: HistogramData<Time>
      ) => void
    ) => {
      realtimeCallback.current = callback
    },
    []
  )

  useEffect(() => {
    let ignore = false
    let ws: WebSocket | null = null
    const interval = INTERVAL_MAP[timeframe] || "1d"

    const fetchKlineData = async () => {
      setIsLoadingChart(true)
      setErrorChart(null)

      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=1000`
        )
        if (!response.ok) {
          throw new Error("Lỗi HTTP Binance Kline: " + response.statusText)
        }

        const data = await response.json()
        if (ignore) return

        const formattedCandles: CandlestickData<Time>[] = []
        const formattedVolumes: HistogramData<Time>[] = []

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((d: any[]) => {
          const time = (d[0] / 1000) as Time
          const open = parseFloat(d[1])
          const high = parseFloat(d[2])
          const low = parseFloat(d[3])
          const close = parseFloat(d[4])
          const volume = parseFloat(d[5])
          const isUp = close >= open
          const color = isUp ? "#26a69a" : "#ef5350"

          formattedCandles.push({ time, open, high, low, close })
          formattedVolumes.push({ time, value: volume, color })
        })

        setHistoricalData(formattedCandles)
        setVolumeData(formattedVolumes)

        // Sau khi lấy data lịch sử, Mở WebSocket
        ws = new WebSocket(
          `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
        )

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            const kline = message.k

            const time = (kline.t / 1000) as Time
            const open = parseFloat(kline.o)
            const high = parseFloat(kline.h)
            const low = parseFloat(kline.l)
            const close = parseFloat(kline.c)
            const volume = parseFloat(kline.v)
            const isUp = close >= open
            const color = isUp ? "#26a69a" : "#ef5350"

            const nextCandle = { time, open, high, low, close }
            const nextVolume = { time, value: volume, color }

            // Kích hoạt tick tới thư viện Chart imperatively
            if (realtimeCallback.current) {
              realtimeCallback.current(nextCandle, nextVolume)
            }
          } catch (e) {
            console.error("Lỗi parse WebSocket Kline:", e)
          }
        }

        ws.onerror = (e) => {
          console.error("Lỗi WebSocket Kline:", e)
        }
      } catch (err) {
        if (!ignore) {
          setErrorChart(
            err instanceof Error ? err : new Error("Lỗi fetch data kline")
          )
        }
      } finally {
        if (!ignore) setIsLoadingChart(false)
      }
    }

    fetchKlineData()

    return () => {
      ignore = true
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [symbol, timeframe])

  return {
    historicalData,
    volumeData,
    isLoadingChart,
    errorChart,
    subscribeRealtime,
  }
}

/**
 * Hook quản lý dữ liệu Giá Ticker 24h từ Binance.
 * Phục vụ cho giao diện thống kê tổng quát
 */
export function useBinanceTicker(symbol: string) {
  const [currentPrice, setCurrentPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const [percentageChange, setPercentageChange] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data24h, setData24h] = useState<any[]>([])

  useEffect(() => {
    let ignore = false
    let ws: WebSocket | null = null

    const fetchTickerData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`
        )
        if (!response.ok) throw new Error("HTTP Ticker Error")
        const data = await response.json()

        if (!ignore) {
          setCurrentPrice(parseFloat(data.lastPrice))
          setPriceChange(parseFloat(data.priceChange))
          setPercentageChange(parseFloat(data.priceChangePercent))
        }

        // Lấy dữ liệu lịch sử 24h cho mini chart
        const klineRes = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1h&limit=24`
        )
        if (klineRes.ok) {
          const klineData = await klineRes.json()
          if (!ignore) {
            setData24h(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              klineData.map((d: any[]) => ({
                time: d[0],
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4]),
                value: parseFloat(d[4]),
              }))
            )
          }
        }

        ws = new WebSocket(
          `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`
        )

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            if (!ignore) {
              setCurrentPrice(parseFloat(message.c))
              setPriceChange(parseFloat(message.p))
              setPercentageChange(parseFloat(message.P))
            }
          } catch (e) {
            console.error("Lỗi parse WebSocket Ticker:", e)
          }
        }
      } catch (err) {
        console.error("Lỗi fetch 24h ticker:", err)
      }
    }

    if (symbol) {
      fetchTickerData()
    }

    return () => {
      ignore = true
      if (ws && ws.readyState === WebSocket.OPEN) ws.close()
    }
  }, [symbol])

  return { currentPrice, priceChange, percentageChange, data24h }
}
