import { CandlestickChart } from "@/components/charts/charts-candle"
import { Timeframe } from "@/lib/utils/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { ChartCandlestick, ChartLine } from "lucide-react"
import { useTheme } from "next-themes"
import { useMemo, useState } from "react"
import { TTypeChart } from "shared/src/types"

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "Giây", value: "1S" },
  { label: "Giờ", value: "1H" },
  { label: "Ngày", value: "1D" },
  { label: "Tuần", value: "1W" },
  { label: "Tháng", value: "1M" },
  { label: "Năm", value: "1Y" },
]

const TYPE_CHART: TTypeChart[] = [
  { label: "Candle", value: "candle", icon: <ChartCandlestick /> },
  { label: "Line", value: "line", icon: <ChartLine /> },
]

type Props = {
  symbol: string
  activeTimeframe: Timeframe
  onTimeframeChange: (timeframe: Timeframe) => void
}

export const SectionChart: React.FC<Props> = ({
  symbol,
  activeTimeframe,
  onTimeframeChange,
}) => {
  const { resolvedTheme } = useTheme()
  const [typeChart, setTypeChart] = useState<TTypeChart>(TYPE_CHART[0])

  const colors = useMemo(
    () => ({
      backgroundColor: resolvedTheme === "dark" ? "#1f2937" : "#fff",
      textColor: resolvedTheme === "dark" ? "#d1d4dc" : "#1f2937",
      upColor: "#26a69a",
      downColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      vertLines: resolvedTheme === "dark" ? "#374151" : "#e0e1f9",
      horzLines: resolvedTheme === "dark" ? "#374151" : "#e0e1f9",
    }),
    [resolvedTheme]
  )

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <Select
          value={activeTimeframe}
          onValueChange={(value) => onTimeframeChange(value as Timeframe)}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Chọn khung thời gian" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {TIMEFRAMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={typeChart.value}
          onValueChange={(value) =>
            setTypeChart(
              TYPE_CHART.find((t) => t.value === value) || TYPE_CHART[0]
            )
          }
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Chọn loại biểu đồ" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {TYPE_CHART.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  <div className="flex items-center gap-1">
                    <div>{option.icon}</div>
                    <p>{option.label}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        style={{
          overflow: "hidden",
          maxWidth: "800px",
        }}
      >
        <CandlestickChart
          type={typeChart}
          symbol={symbol}
          interval={activeTimeframe}
          colors={colors}
        />
      </div>
    </div>
  )
}
