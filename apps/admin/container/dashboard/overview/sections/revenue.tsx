"use client"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Pie, PieChart } from "recharts"
const chartData = [
  { type: "spot", total: 123000, fill: "#ebeefa" },
  { type: "futures", total: 23000, fill: "#1741cc" },
]
const chartConfig = {
  total: {
    label: "Giao dịch",
  },
  spot: {
    label: "Spot",
    color: "#ebeefa",
  },
  futures: {
    label: "Futures",
    color: "#1741cc",
  },
} satisfies ChartConfig

export const Revenue: React.FC = () => {
  const total = chartData.reduce((acc, item) => acc + item.total, 0)
  return (
    <div>
      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground/90">
                Revenue
              </span>
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                Overview
              </span>
            </div>
            <div className="flex items-center justify-center text-primary">
              <span className="text-lg font-bold">
                {total.toLocaleString()} USD
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#ebeefa]" />
              <span className="text-sm font-medium tracking-tight text-foreground/90">
                Spot
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#1741cc]" />
              <span className="text-sm font-medium tracking-tight text-foreground/90">
                Futures
              </span>
            </div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="type" hideLabel />}
              />
              <Pie data={chartData} dataKey="total" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
