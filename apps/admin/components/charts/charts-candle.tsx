import { useBinanceKline } from "@/lib/hooks/use-market-data"
import { Timeframe } from "@/lib/utils/utils"
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  ISeriesApi,
  LineSeries,
} from "lightweight-charts"
import { Loader2 } from "lucide-react"
import React, { useEffect, useRef } from "react"
import { TTypeChart } from "shared/src/types"

export type ChartProps = {
  type: TTypeChart
  symbol: string
  interval?: Timeframe
  colors?: {
    backgroundColor?: string
    textColor?: string
    upColor?: string
    downColor?: string
    wickUpColor?: string
    wickDownColor?: string
    vertLines?: string
    horzLines?: string
  }
}

export const CandlestickChart: React.FC<ChartProps> = ({
  type,
  symbol,
  interval = "1D",
  colors: {
    backgroundColor = "#fff",
    textColor = "#d1d4dc",
    upColor = "#26a69a",
    downColor = "#ef5350",
    wickUpColor = "#26a69a",
    wickDownColor = "#ef5350",
    vertLines = "#e0e1f9",
    horzLines = "#e0e1f9",
  } = {},
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const seriesRef = useRef<
    ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | null
  >(null)
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null)

  // Gọi Hook quản lý dữ liệu Binance (REST + WebSocket)
  const {
    historicalData,
    volumeData,
    isLoadingChart,
    errorChart,
    subscribeRealtime,
  } = useBinanceKline(symbol, interval)

  // 1. Khởi tạo biểu đồ và nạp data lịch sử
  useEffect(() => {
    if (!chartContainerRef.current) return
    if (isLoadingChart) return // Chưa load xong API thì khoan vẽ Chart

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        attributionLogo: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: vertLines },
        horzLines: { color: horzLines },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })

    // Xử lý tạo Series (Candle hoặc Line)
    let mainSeries
    if (type.value === "candle") {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor,
        downColor,
        borderVisible: false,
        wickUpColor,
        wickDownColor,
      })
      mainSeries.setData(historicalData)
    } else {
      mainSeries = chart.addSeries(LineSeries, {
        color: "#100cf5",
        lineWidth: 2,
      })
      mainSeries.setData(
        historicalData.map((d) => ({
          time: d.time,
          value: d.close,
        }))
      )
    }

    mainSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.4 },
    })
    seriesRef.current = mainSeries

    // Xử lý tạo Volume Histogram
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    })
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    })
    volumeSeries.setData(volumeData)
    volumeSeriesRef.current = volumeSeries

    // Handle WebSocket trực tiếp qua tham chiếu (Callbacks Reference) để tránh re-renders UI
    subscribeRealtime((candleUpdate, volumeUpdate) => {
      try {
        if (type.value === "candle") {
          ;(seriesRef.current as ISeriesApi<"Candlestick">).update(candleUpdate)
        } else {
          ;(seriesRef.current as ISeriesApi<"Line">).update({
            time: candleUpdate.time,
            value: candleUpdate.close,
          })
        }
        volumeSeriesRef.current?.update(volumeUpdate)
      } catch (err) {
        console.warn("Chart realtime update skipped:", err)
      }
    })

    // Resize Event Handle
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
      seriesRef.current = null
      volumeSeriesRef.current = null
    }
  }, [
    type,
    historicalData,
    volumeData,
    isLoadingChart,
    subscribeRealtime,
    backgroundColor,
    textColor,
    upColor,
    downColor,
    wickUpColor,
    wickDownColor,
    vertLines,
    horzLines,
  ])

  if (errorChart) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <p className="font-medium text-red-500">
          Lỗi dữ liệu: {errorChart.message}
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] w-full">
      {isLoadingChart && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}
      <div
        ref={chartContainerRef}
        className="h-full w-full overflow-hidden rounded-lg"
      />
    </div>
  )
}
