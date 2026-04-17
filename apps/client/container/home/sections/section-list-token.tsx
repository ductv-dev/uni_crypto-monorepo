"use client"
import { CardToken1 } from "@/components/custom/cards/card-token-1"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { TToken } from "shared/src/types"

type Props = {
  data: TToken[]
  isDesktop?: boolean
  isLoading?: boolean
  isError?: boolean
}

const TokenSkeleton = () => (
  <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-[64px] w-full rounded-none" />
    ))}
  </div>
)

const TokenError = () => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-card py-8 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-background text-red-500">
      <AlertCircle size={20} strokeWidth={2} />
    </div>
    <p className="text-sm text-red-500">Lỗi tải dữ liệu thị trường</p>
  </div>
)

export const SectionListToken: React.FC<Props> = ({
  data,
  isDesktop = false,
  isLoading,
  isError,
}) => {
  const route = useRouter()

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-2">
        <p className="px-1 text-xs font-semibold tracking-wider text-foreground/40 uppercase">
          Thị trường
        </p>
        {isLoading && <TokenSkeleton />}
        {isError && <TokenError />}
        {!isLoading && !isError && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {data.map((token, i) => (
              <div
                key={token.address}
                className={i < data.length - 1 ? "border-b border-border" : ""}
              >
                <CardToken1
                  name={token.name}
                  symbol={token.symbol}
                  image={token.logoURI}
                  number_changes={token.number_changes}
                  onClick={() => route.push(`/token/${token.symbol}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 px-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[64px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-2.5">
        <TokenError />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 px-2.5">
      {data.map((token) => (
        <CardToken1
          key={token.address}
          name={token.name}
          symbol={token.symbol}
          image={token.logoURI}
          number_changes={token.number_changes}
          onClick={() => route.push(`/token/${token.symbol}`)}
        />
      ))}
    </div>
  )
}
