import { ReactNode } from "react"

export type TTypeChart = {
  label: string
  value: "candle" | "line"
  icon: ReactNode
}
