import { clsx, type ClassValue } from "clsx"
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
