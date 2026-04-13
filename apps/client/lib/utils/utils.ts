import { clsx, type ClassValue } from "clsx"
import { CandlestickData, Time } from "lightweight-charts"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenHex(str: string, start = 6, end = 4) {
  if (!str) return ""

  // Chuẩn hóa về chữ thường
  const s = str.toLowerCase()

  if (s.length <= start + end) return s

  return `${s.slice(0, start)}...${s.slice(-end)}`
}

export type Timeframe = "1S" | "1H" | "1D" | "1W" | "1M" | "1Y"

export function generateOHLC(
  count = 150,
  startPrice = 120,
  timeframe: Timeframe = "1D"
) {
  const data = []
  let open = startPrice

  // Điều chỉnh mức độ biến động giá (volatility) dựa trên khung thời gian
  let volatility = 4
  switch (timeframe) {
    case "1S":
      volatility = 1
      break
    case "1H":
      volatility = 100
      break
    case "1D":
      volatility = 4
      break
    case "1W":
      volatility = 10
      break
    case "1M":
      volatility = 25
      break
    case "1Y":
      volatility = 80
      break
  }

  // 1. Tính toán thời điểm bắt đầu (lui về quá khứ 'count' khoảng thời gian)
  const currentTime = new Date()
  if (timeframe === "1S")
    currentTime.setSeconds(currentTime.getSeconds() - count)
  if (timeframe === "1H") currentTime.setHours(currentTime.getHours() - count)
  if (timeframe === "1D") currentTime.setDate(currentTime.getDate() - count)
  if (timeframe === "1W") currentTime.setDate(currentTime.getDate() - count * 7)
  if (timeframe === "1M") currentTime.setMonth(currentTime.getMonth() - count)
  if (timeframe === "1Y")
    currentTime.setFullYear(currentTime.getFullYear() - count)

  // 2. Tạo dữ liệu tiến dần về hiện tại
  for (let i = 0; i < count; i++) {
    // Cộng thêm thời gian cho cây nến tiếp theo
    if (timeframe === "1S") currentTime.setSeconds(currentTime.getSeconds() + 1)
    if (timeframe === "1H") currentTime.setHours(currentTime.getHours() + 1)
    if (timeframe === "1D") currentTime.setDate(currentTime.getDate() + 1)
    if (timeframe === "1W") currentTime.setDate(currentTime.getDate() + 7)
    if (timeframe === "1M") currentTime.setMonth(currentTime.getMonth() + 1)
    if (timeframe === "1Y")
      currentTime.setFullYear(currentTime.getFullYear() + 1)

    // Lightweight charts yêu cầu timestamp Unix (tính bằng GIÂY)
    const time = Math.floor(currentTime.getTime() / 1000) as Time

    const change = (Math.random() - 0.48) * volatility
    const close = Math.max(1, open + change)

    // Bóng nến (wick)
    const high = Math.max(open, close) + Math.random() * (volatility / 2)
    const low = Math.min(open, close) - Math.random() * (volatility / 2)

    data.push({
      time,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
    })

    open = close
  }

  return data
}

export function generateVolumeData(data: CandlestickData<Time>[]) {
  return data.map((candle) => ({
    time: candle.time,
    value: candle.high - candle.low,
    color: candle.close >= candle.open ? "#92d3cc" : "#f6a8a7",
  }))
}

// random data 24h của token
export function randomData24h() {
  const data = []
  const now = Date.now()
  for (let i = 0; i < 24; i++) {
    data.push({
      time: now - i * 60 * 60 * 1000,
      value: Math.random() * 100,
    })
  }
  return data
}
// Lấy thời gian và giá trị nến sau
export function generateNextCandle(
  previousCandle: CandlestickData<Time>
): CandlestickData<Time> {
  const time = (Number(previousCandle.time) + 1) as Time
  const open = previousCandle.close
  const volatility = 1
  const change = (Math.random() - 0.48) * volatility
  const close = Math.max(1, open + change)
  const high = Math.max(open, close) + Math.random() * (volatility / 2)
  const low = Math.min(open, close) - Math.random() * (volatility / 2)

  return {
    time,
    open: +open.toFixed(2),
    high: +high.toFixed(2),
    low: +low.toFixed(2),
    close: +close.toFixed(2),
  }
}
