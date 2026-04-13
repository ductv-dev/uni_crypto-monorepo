import React from "react"

export type DataPoint = {
  time: number
  value: number
  close: number
  open: number
  high: number
  low: number
}

export type MiniChartProps = {
  data: DataPoint[]
  width?: number
  height?: number
  strokeWidth?: number
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  width = 120,
  height = 40,
  strokeWidth = 2,
}) => {
  if (!data || data.length < 2) return null

  const firstPoint = data[0]
  const lastPoint = data[data.length - 1]

  if (!firstPoint || !lastPoint) return null

  const firstValue = firstPoint.value
  const lastValue = lastPoint.value
  const isPositive = lastValue >= firstValue
  const strokeColor = isPositive ? "#4caf50" : "#d32f2f"

  const minX = Math.min(...data.map((d) => d.time))
  const maxX = Math.max(...data.map((d) => d.time))
  const minY = Math.min(...data.map((d) => d.value))
  const maxY = Math.max(...data.map((d) => d.value))

  const paddingY = strokeWidth
  const innerHeight = height - paddingY * 2

  const getSvgX = (x: number): number => ((x - minX) / (maxX - minX)) * width

  const getSvgY = (y: number): number => {
    if (maxY === minY) return height / 2
    return paddingY + innerHeight - ((y - minY) / (maxY - minY)) * innerHeight
  }

  const pathD = data
    .map((point, index) => {
      const x = getSvgX(point.time)
      const y = getSvgY(point.value)
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
