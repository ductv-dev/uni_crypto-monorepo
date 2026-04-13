"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { TToken } from "shared/src/types"

type Props = {
  data: TToken
  currentPrice: number
  priceChange: number
  percentageChange: number
}
export const SectionMain: React.FC<Props> = ({
  data,
  currentPrice,
  priceChange,
  percentageChange,
}) => {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="flex gap-2.5">
      <div className="flex-1">
        <div className="mt-16 flex flex-col gap-2.5 p-2.5 md:mt-0">
          <div className="flex gap-2.5">
            <Avatar className="h-12 w-12">
              <AvatarImage src={data.logoURI} alt="token image" className="" />
              <AvatarFallback>{data.symbol.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold text-foreground/60">
                  {data.name}
                </p>
                <Badge className="h-6 bg-primary/15 px-2.5 text-primary">
                  <ShieldCheck className="size-3.5" />
                  Verified
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-foreground/60">
                <p>{data.symbol}</p>
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
      </div>
      {/* <FavoriteStar
        isFavorite={isFavorite}
        onClick={() => setIsFavorite(!isFavorite)}
      /> */}
    </div>
  )
}
