"use client"
import { CandlestickChart } from "@/components/custom/charts/charts-candle"
import { useDataToken } from "@/hooks/token/use-data-token"
import { useBinanceTicker } from "@/hooks/use-market-data"
import { Timeframe } from "@/lib/utils/utils"
import { TTypeChart } from "@/types/type-chart.type"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { TToken } from "@workspace/shared/types"
import {
  ChartCandlestick,
  ChartLine,
  ChevronDown,
  ChevronUp,
  SquareChevronDown,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useState } from "react"

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

export const SectionChart: React.FC = () => {
  const { data: tokenList = [] } = useDataToken()
  const { resolvedTheme } = useTheme()
  const [typeChart, setTypeChart] = useState<TTypeChart>(TYPE_CHART[0]!)
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>("1D")
  const [symbol, setSymbol] = useState<TToken | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!symbol && tokenList.length > 0) {
      setSymbol(tokenList[0]!)
    }
  }, [symbol, tokenList])

  const { currentPrice, priceChange, percentageChange } = useBinanceTicker(
    symbol?.symbol ?? ""
  )

  const colors = useMemo(
    () => ({
      backgroundColor: resolvedTheme === "dark" ? "#161617" : "#fffefe",
      textColor: resolvedTheme === "dark" ? "#d1d4dc" : "#1f2937",
      upColor: "#2ebc85",
      downColor: "#f6465d",
      wickUpColor: "#2ebc85",
      wickDownColor: "#f6465d",
      vertLines: resolvedTheme === "dark" ? "#262a35" : "#f6f6f6",
      horzLines: resolvedTheme === "dark" ? "#262a35" : "#f6f6f6",
    }),
    [resolvedTheme]
  )

  return (
    <div className="shrink-0">
      <Card className="">
        <CardContent>
          {!symbol ? null : (
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end">
                {/* Khối thông tin token */}
                <div className="flex gap-2.5 p-2.5 md:mt-0">
                  <div className="flex gap-2.5">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={symbol.logoURI}
                        alt="token image"
                        className=""
                      />
                      <AvatarFallback>
                        {symbol.symbol.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold text-foreground/60">
                          {symbol.name}
                        </p>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Badge className="h-6 bg-primary/15 px-2.5 text-primary">
                              <SquareChevronDown />
                            </Badge>
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <PopoverHeader>
                              <PopoverTitle>Chọn token</PopoverTitle>
                            </PopoverHeader>
                            <ScrollArea className="h-[300px]">
                              <div className="flex flex-col">
                                {tokenList.map((token) => (
                                  <button
                                    onClick={() => {
                                      setSymbol(token)
                                      setOpen(false)
                                    }}
                                    key={token.address}
                                    className={`flex cursor-pointer items-center gap-2 rounded-lg p-2.5 ${token.address === symbol.address ? "bg-primary/15" : ""}`}
                                  >
                                    <Avatar className="h-12 w-12">
                                      <AvatarImage
                                        src={token.logoURI}
                                        alt="token image"
                                        className=""
                                      />
                                      <AvatarFallback>
                                        {token.symbol.charAt(0) || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-start">
                                      <p className="text-sm font-semibold text-foreground/60">
                                        {token.name}
                                      </p>
                                      <p className="text-sm text-foreground/60">
                                        {token.symbol}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-foreground/60">
                        <p>{symbol.symbol}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-foreground/80">
                        {currentPrice.toFixed(2)} US$
                      </p>
                      <div className="mt-1 flex gap-2.5">
                        <div className="flex">
                          {priceChange > 0 ? (
                            <ChevronUp className="text-green-500" />
                          ) : (
                            <ChevronDown className="text-red-500" />
                          )}
                          <p className="text-foreground/60">
                            {priceChange.toFixed(2)} US$
                          </p>
                        </div>
                        <p className="text-foreground/60">
                          ({percentageChange.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Khối chọn khung thời gian và loại biểu đồ */}
                <div className="flex flex-1 items-center justify-between gap-2.5 p-2.5 lg:justify-end">
                  <Select
                    value={activeTimeframe}
                    onValueChange={(value) =>
                      setActiveTimeframe(value as Timeframe)
                    }
                  >
                    <SelectTrigger className="">
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
                        TYPE_CHART.find((t) => t.value === value) ||
                          TYPE_CHART[0]!
                      )
                    }
                  >
                    <SelectTrigger className="w-fit">
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
              </div>
              <div className="col-span-2 flex flex-col gap-2.5">
                <div className="h-[600px] w-full overflow-hidden border">
                  <CandlestickChart
                    type={typeChart}
                    symbol={symbol.symbol}
                    interval={activeTimeframe}
                    colors={colors}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
