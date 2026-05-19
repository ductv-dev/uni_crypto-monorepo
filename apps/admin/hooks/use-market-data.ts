"use client"
import { requestJson } from "@/lib/api/client"
import { Timeframe } from "@/lib/utils/utils"
import { CandlestickData, HistogramData, Time } from "lightweight-charts"
import { io, type Socket } from "socket.io-client"
import { useCallback, useEffect, useRef, useState } from "react"

const INTERVAL_MAP: Record<string, string> = {
  "1S": "1s",
  "1MIN": "1m",
  "5MIN": "5m",
  "15MIN": "15m",
  "1H": "1h",
  "1D": "1d",
  "1W": "1w",
  "1M": "1M",
  "1Y": "1M",
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3002"
const MARKET_INTERVAL_MAP = {
  "1S": "1m",
  "1MIN": "1m",
  "5MIN": "5m",
  "15MIN": "15m",
  "1H": "1h",
  "1D": "1d",
  "1W": "1d",
  "1M": "1d",
  "1Y": "1d",
} as const

type MarketRealtimeInterval = (typeof MARKET_INTERVAL_MAP)[Timeframe]

type MarketCandleResponse = {
  bucket: string
  open: string
  high: string
  low: string
  close: string
  volume: string
  quoteVolume: string
}

type MarketKlineUpdatePayload = {
  marketId: string
  symbol: string
  interval: MarketRealtimeInterval
  bucket: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  quoteVolume: number
  lastTradeAt: string | null
  hasTrade: boolean
  emittedAt: string
}

type MarketTickerPoint = {
  time: number
  open: number
  high: number
  low: number
  close: number
  value: number
}

const candleColor = (open: number, close: number) =>
  close >= open ? "#26a69a" : "#ef5350"

const toChartTime = (value: string): Time =>
  Math.floor(new Date(value).getTime() / 1000) as Time

const getMarketInterval = (timeframe: Timeframe): MarketRealtimeInterval =>
  MARKET_INTERVAL_MAP[timeframe]

const getMarketCandles = async (
  marketId: string,
  interval: MarketRealtimeInterval,
  limit: number
): Promise<MarketCandleResponse[]> =>
  requestJson<MarketCandleResponse[]>(
    `/api/proxy/markets/${marketId}/candles?interval=${interval}&limit=${limit}`,
    {
      method: "GET",
      defaultErrorMessage: "Failed to fetch market candles",
    }
  )

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

export function useMarketKline(
  marketId: string | undefined,
  symbol: string | undefined,
  timeframe: Timeframe
) {
  const [historicalData, setHistoricalData] = useState<CandlestickData<Time>[]>(
    []
  )
  const [volumeData, setVolumeData] = useState<HistogramData<Time>[]>([])
  const [isLoadingChart, setIsLoadingChart] = useState(true)
  const [errorChart, setErrorChart] = useState<Error | null>(null)
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
    let socket: Socket | null = null

    const load = async () => {
      if (!marketId || !symbol) {
        setHistoricalData([])
        setVolumeData([])
        setErrorChart(null)
        setIsLoadingChart(false)
        return
      }

      setIsLoadingChart(true)
      setErrorChart(null)

      try {
        const interval = getMarketInterval(timeframe)
        const candles = await getMarketCandles(marketId, interval, 500)
        if (ignore) return

        const formattedCandles = candles.map<CandlestickData<Time>>((item) => ({
          time: toChartTime(item.bucket),
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
        }))
        const formattedVolumes = candles.map<HistogramData<Time>>((item) => {
          const open = Number(item.open)
          const close = Number(item.close)

          return {
            time: toChartTime(item.bucket),
            value: Number(item.volume),
            color: candleColor(open, close),
          }
        })

        setHistoricalData(formattedCandles)
        setVolumeData(formattedVolumes)

        socket = io(WS_URL, {
          transports: ["websocket"],
          reconnection: true,
        })

        socket.on("connect", () => {
          socket?.emit("market.join", { symbol, interval })
        })

        socket.on("kline.update", (payload: MarketKlineUpdatePayload) => {
          if (
            ignore ||
            payload.marketId !== marketId ||
            payload.interval !== interval
          ) {
            return
          }

          const nextCandle: CandlestickData<Time> = {
            time: toChartTime(payload.bucket),
            open: payload.open,
            high: payload.high,
            low: payload.low,
            close: payload.close,
          }
          const nextVolume: HistogramData<Time> = {
            time: toChartTime(payload.bucket),
            value: payload.volume,
            color: candleColor(payload.open, payload.close),
          }

          realtimeCallback.current?.(nextCandle, nextVolume)
        })
      } catch (error) {
        if (!ignore) {
          setErrorChart(
            error instanceof Error
              ? error
              : new Error("Failed to load market kline")
          )
          setHistoricalData([])
          setVolumeData([])
        }
      } finally {
        if (!ignore) {
          setIsLoadingChart(false)
        }
      }
    }

    void load()

    return () => {
      ignore = true
      socket?.disconnect()
    }
  }, [marketId, symbol, timeframe])

  return {
    historicalData,
    volumeData,
    isLoadingChart,
    errorChart,
    subscribeRealtime,
  }
}

export function useMarketTicker(
  marketId: string | undefined,
  symbol: string | undefined
) {
  const [currentPrice, setCurrentPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const [percentageChange, setPercentageChange] = useState(0)
  const [data24h, setData24h] = useState<MarketTickerPoint[]>([])

  useEffect(() => {
    let ignore = false
    let socket: Socket | null = null

    const load = async () => {
      if (!marketId || !symbol) {
        setCurrentPrice(0)
        setPriceChange(0)
        setPercentageChange(0)
        setData24h([])
        return
      }

      try {
        const interval: MarketRealtimeInterval = "1h"
        const candles = await getMarketCandles(marketId, interval, 24)
        if (ignore) return

        const points = candles.map<MarketTickerPoint>((item) => ({
          time: new Date(item.bucket).getTime(),
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
          value: Number(item.close),
        }))

        const firstPoint = points[0]
        const lastPoint = points[points.length - 1]
        const nextCurrentPrice = lastPoint?.close ?? 0
        const nextPriceChange = nextCurrentPrice - (firstPoint?.open ?? 0)
        const nextPercentageChange =
          firstPoint && firstPoint.open > 0
            ? (nextPriceChange / firstPoint.open) * 100
            : 0

        setData24h(points)
        setCurrentPrice(nextCurrentPrice)
        setPriceChange(nextPriceChange)
        setPercentageChange(nextPercentageChange)

        socket = io(WS_URL, {
          transports: ["websocket"],
          reconnection: true,
        })

        socket.on("connect", () => {
          socket?.emit("market.join", { symbol, interval })
        })

        socket.on("kline.update", (payload: MarketKlineUpdatePayload) => {
          if (
            ignore ||
            payload.marketId !== marketId ||
            payload.interval !== interval
          ) {
            return
          }

          setCurrentPrice(payload.close)
          setData24h((previous) => {
            const nextPoint: MarketTickerPoint = {
              time: new Date(payload.bucket).getTime(),
              open: payload.open,
              high: payload.high,
              low: payload.low,
              close: payload.close,
              value: payload.close,
            }

            if (previous.length === 0) {
              const nextPrice = payload.close - payload.open
              setPriceChange(nextPrice)
              setPercentageChange(
                payload.open > 0 ? (nextPrice / payload.open) * 100 : 0
              )
              return [nextPoint]
            }

            const next = [...previous]
            const lastPoint = next[next.length - 1]
            if (lastPoint && lastPoint.time === nextPoint.time) {
              next[next.length - 1] = nextPoint
            } else {
              next.push(nextPoint)
            }

            const trimmed = next.slice(-24)
            const openingPrice = trimmed[0]?.open ?? payload.open
            const nextPrice = payload.close - openingPrice
            setPriceChange(nextPrice)
            setPercentageChange(
              openingPrice > 0 ? (nextPrice / openingPrice) * 100 : 0
            )

            return trimmed
          })
        })
      } catch (error) {
        console.error("Failed to load market ticker:", error)

        if (!ignore) {
          setCurrentPrice(0)
          setPriceChange(0)
          setPercentageChange(0)
          setData24h([])
        }
      }
    }

    void load()

    return () => {
      ignore = true
      socket?.disconnect()
    }
  }, [marketId, symbol])

  return { currentPrice, priceChange, percentageChange, data24h }
}
