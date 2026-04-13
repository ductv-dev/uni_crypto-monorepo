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

type TcardToken1Props = {
  rank?: number
  name: string
  symbol?: string
  description?: string
  image: string
  number_changes?: number
  onClick?: () => void
  className?: string
}

export const CardToken1: React.FC<TcardToken1Props> = ({
  rank,
  name,
  symbol,
  description,
  image,
  onClick,
  className,
}) => {
  const symbolUsdt = symbol ? `${symbol}USDT` : ""
  const {
    currentPrice,
    data: data24h,
    percentPriceChange: percentageChange,
    isLoading,
  } = use24hData(symbolUsdt)
  return (
    <div
      onClick={onClick}
      className={
        cn(className) +
        " flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-4 py-2 hover:bg-accent"
      }
    >
      <div className="flex w-6/10 items-center gap-2.5">
        {rank && <span className="font-medium text-foreground/60">{rank}</span>}

        <Avatar className="h-12 w-12">
          <AvatarImage src={image} alt="token image" className="" />
          <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>
          {symbol && (
            <span className="text-xs text-foreground/60">{symbol}</span>
          )}
        </div>
      </div>
      <div className="flex w-2/10 justify-start">
        {isLoading ? (
          <Skeleton className="h-[12px] w-[50px] rounded-full" />
        ) : (
          <MiniChart data={data24h} width={50} height={12} strokeWidth={2} />
        )}
      </div>
      <div className="flex w-2/10 flex-col items-end">
        {isLoading ? (
          <Skeleton className="mb-1 h-5 w-16" />
        ) : (
          <span className="text-sm font-medium">
            {(currentPrice || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{" "}
            US$
          </span>
        )}
        {description && (
          <span className="text-xs text-foreground/60">{description}</span>
        )}
        <div className="flex items-center justify-end">
          {isLoading ? (
            <Skeleton className="mt-1 h-4 w-10" />
          ) : (percentageChange !== 0 ? percentageChange : 0) > 0 ? (
            <div className="flex">
              <ChevronUp className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-green-500">
                {(percentageChange !== 0 ? percentageChange : 0).toFixed(2)}%
              </span>
            </div>
          ) : (percentageChange !== 0 ? percentageChange : 0) < 0 ? (
            <div className="flex">
              <ChevronDown className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-red-500">
                {Math.abs(
                  percentageChange !== 0 ? percentageChange : 0
                ).toFixed(2)}
                %
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-foreground/60">0%</span>
          )}
        </div>
      </div>
    </div>
  )
}
