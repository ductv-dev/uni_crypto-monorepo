import {
  ChartLine,
  ChartNoAxesCombined,
  ChartPie,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { TToken } from "@workspace/shared/types"

type Props = {
  data: TToken
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1_000_000 ? 2 : 2,
  }).format(value)

export const StatisticalSection: React.FC<Props> = ({ data }) => {
  const circulatingSupply = 12_500_000 * (18 / data.decimals)
  const fullyDilutedSupply = circulatingSupply * 1.2
  const marketCap = data.usdt * circulatingSupply
  const fdv = data.usdt * fullyDilutedSupply
  const volume24h = marketCap * 0.076
  const high52w = data.usdt * 1.42
  const low52w = data.usdt * 0.48
  const liquidity = marketCap * 0.11

  const statisticalData = [
    {
      label: "Vốn hóa thị trường",
      icon: <ChartNoAxesCombined />,
      value: `${formatMoney(marketCap)} US$`,
    },
    {
      label: "Định giá pha loãng hoàn toàn",
      icon: <ChartLine />,
      value: `${formatMoney(fdv)} US$`,
    },
    {
      label: "Khối lượng trong vòng 24h",
      icon: <ChartPie />,
      value: `${formatMoney(volume24h)} US$`,
    },
    {
      label: "Thanh khoản ước tính",
      icon: <ChartPie />,
      value: `${formatMoney(liquidity)} US$`,
    },
    {
      label: "Giá cao nhất trong 52 tuần",
      icon: <TrendingUp />,
      value: `${formatMoney(high52w)} US$`,
    },
    {
      label: "Giá thấp nhất trong vòng 52 tuần",
      icon: <TrendingDown />,
      value: `${formatMoney(low52w)} US$`,
    },
  ]

  return (
    <div className="px-2.5">
      <p className="text-lg font-bold text-foreground/60">Thống kê</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {statisticalData.map((item, index) => (
          <div
            key={index}
            className="flex min-h-28 flex-col justify-between rounded-xl border border-border bg-card px-4 py-3 text-foreground/60"
          >
            <div className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 shrink-0">{item.icon}</div>
              <p className="line-clamp-2 leading-5">{item.label}</p>
            </div>

            <p className="text-base font-semibold text-foreground/80">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
