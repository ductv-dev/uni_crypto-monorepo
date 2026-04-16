"use client"
import { useBinanceTicker } from "@/lib/hooks/use-market-data"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { ChevronsDown, ChevronsUp } from "lucide-react"
import { TToken } from "shared/src/types"

type Props = {
  data: TToken
}

export const CardToken1: React.FC<Props> = ({ data }) => {
  const { currentPrice, percentageChange } = useBinanceTicker(data.symbol)
  return (
    <div
      key={data.address}
      className="flex w-full max-w-lg items-center gap-2 p-2.5"
    >
      <Avatar className="h-6 w-6">
        <AvatarImage src={data.logoURI} alt="token image" className="" />
        <AvatarFallback>{data.symbol.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <p className="flex-1 text-sm font-semibold text-foreground/60">
        {data.name}
      </p>
      <p className="flex-1 text-sm text-primary">{currentPrice}</p>
      <div className="flex gap-2">
        {percentageChange > 0 ? (
          <div className="flex items-center gap-1">
            <ChevronsUp className="h-4 w-4 text-green-500" />
            <p className="text-sm text-green-500">{percentageChange}%</p>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <ChevronsDown className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-500">{percentageChange}%</p>
          </div>
        )}
      </div>
    </div>
  )
}
