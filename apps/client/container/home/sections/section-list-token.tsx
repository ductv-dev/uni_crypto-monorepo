import { CardToken1 } from "@/components/custom/cards/card-token-1"
import { useRouter } from "next/navigation"
import { TToken } from "shared/src/types"

type Props = {
  data: TToken[]
  isDesktop?: boolean
}
export const SectionListToken: React.FC<Props> = ({
  data,
  isDesktop = false,
}) => {
  const route = useRouter()

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-2">
        <p className="px-1 text-xs font-semibold tracking-wider text-foreground/40 uppercase">
          Thị trường
        </p>
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
