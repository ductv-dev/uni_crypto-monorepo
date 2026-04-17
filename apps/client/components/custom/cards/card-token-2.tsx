import { use24hData } from "@/lib/hooks/use-24h-data"
import { cn } from "@/lib/utils/utils"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ChevronDown, ChevronUp } from "lucide-react"

type TCardToken2 = {
  image: string
  name: string
  symbol: string
  className?: string
  onClick?: () => void
}

export const CardToken2: React.FC<TCardToken2> = ({
  image,
  symbol,
  className,
  onClick,
}) => {
  const symbolUsdt = symbol ? `${symbol}USDT` : ""
  const { data, isLoading } = use24hData(symbolUsdt)
  const currentPrice = data?.currentPrice || 0
  const percentageChange = data?.percentPriceChange || 0

  return (
    <div
      onClick={onClick}
      className={
        `w-full max-w-50 cursor-pointer rounded-[10px] border border-border p-2.5` +
        cn(className)
      }
    >
      <div className="flex items-center gap-2.5">
        <div className="relative h-6 w-6 shrink-0">
          <img
            src={image}
            alt={symbol}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <p className="flex-1 text-lg">{symbol}</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-6 w-24" />
      ) : (
        <p className="font-semibold text-foreground/60">
          {(currentPrice || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
          US$
        </p>
      )}

      {isLoading ? (
        <Skeleton className="mt-1 h-4 w-16" />
      ) : (percentageChange ?? 0) > 0 ? (
        <div className="flex items-center">
          <ChevronUp className="h-4 w-4 text-green-500" />
          <span className="font-medium text-green-500">
            {(percentageChange ?? 0).toFixed(2)}%
          </span>
        </div>
      ) : (
        <div className="flex items-center">
          <ChevronDown className="h-4 w-4 text-red-500" />
          <span className="font-medium text-red-500">
            {Math.abs(percentageChange ?? 0).toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  )
}
