"use client"
import { MiniChart } from "@/components/charts/chart-widget"
import { use24hData } from "@/lib/hooks/use-24h-data"
import { cn } from "@/lib/utils/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ChevronDown, ChevronUp } from "lucide-react"

type TCardToken1Props = {
  rank?: number
  name: string
  symbol?: string
  description?: string
  image: string
  number_changes?: number
  onClick?: () => void
  className?: string
}

const PriceChange = ({ value }: { value: number }) => {
  if (value > 0) {
    return (
      <div className="flex items-center gap-0.5">
        <ChevronUp className="h-3.5 w-3.5 text-green-500" />
        <span className="text-xs font-medium text-green-500">
          {value.toFixed(2)}%
        </span>
      </div>
    )
  }
  if (value < 0) {
    return (
      <div className="flex items-center gap-0.5">
        <ChevronDown className="h-3.5 w-3.5 text-red-500" />
        <span className="text-xs font-medium text-red-500">
          {Math.abs(value).toFixed(2)}%
        </span>
      </div>
    )
  }
  return <span className="text-xs font-medium text-foreground/40">0.00%</span>
}

export const CardToken1: React.FC<TCardToken1Props> = ({
  rank,
  name,
  symbol,
  description,
  image,
  onClick,
  className,
}) => {
  const symbolUsdt = symbol ? `${symbol}USDT` : ""
  const { data, isLoading } = use24hData(symbolUsdt)

  const currentPrice = data?.currentPrice ?? 0
  const percentageChange = data?.percentPriceChange ?? 0

  return (
    <div
      onClick={onClick}
      className={cn(
        "grid w-full cursor-pointer grid-cols-5 items-center gap-2.5 rounded-lg px-4 py-2 hover:bg-accent",
        className
      )}
    >
      {/* Tên token */}
      <div className="col-span-3 flex min-w-0 flex-1 items-center gap-2.5">
        {rank !== undefined && (
          <span className="w-5 shrink-0 text-center text-xs font-medium text-foreground/40">
            {rank}
          </span>
        )}

        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={image} alt={`${name} logo`} />
          <AvatarFallback className="text-xs">
            {name?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold">{name}</span>
          {symbol && (
            <span className="text-xs text-foreground/50">{symbol}</span>
          )}
          {description && (
            <span className="truncate text-xs text-foreground/40">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Mini chart */}
      <div className="col-span-1 w-14 items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-3 w-12 rounded-full" />
        ) : (
          data?.data && (
            <MiniChart
              data={data.data}
              width={50}
              height={14}
              strokeWidth={1.5}
            />
          )
        )}
      </div>

      {/* Giá & % thay đổi */}
      <div className="col-span-1 flex shrink-0 flex-col items-end gap-0.5">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-10" />
          </>
        ) : (
          <>
            <span className="text-sm font-semibold tabular-nums">
              {currentPrice > 0
                ? currentPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "—"}{" "}
              <span className="text-xs font-normal text-foreground/40">$</span>
            </span>
            <PriceChange value={percentageChange} />
          </>
        )}
      </div>
    </div>
  )
}
