import { ChevronDown, ChevronUp } from "lucide-react"

type Props = {
  total_balance: number
  number_changes: number
  isDesktop?: boolean
}
export const SectionBalance: React.FC<Props> = ({
  total_balance,
  number_changes,
  isDesktop = false,
}) => {
  const formattedBalance = total_balance?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })

  if (isDesktop) {
    return (
      <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
        <p className="mb-1 text-sm text-foreground/50">Tổng số dư</p>
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          {formattedBalance} US$
        </h2>
        <div className="mt-2 flex items-center gap-1">
          {number_changes >= 0 ? (
            <>
              <ChevronUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-semibold text-green-500">
                +{number_changes}%
              </span>
              <span className="ml-1 text-xs text-foreground/40">
                so với hôm qua
              </span>
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5 text-red-500" />
              <span className="text-sm font-semibold text-red-500">
                {number_changes}%
              </span>
              <span className="ml-1 text-xs text-foreground/40">
                so với hôm qua
              </span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-2.5">
      <h1 className="text text-3xl font-bold text-foreground/60">
        {formattedBalance} US$
      </h1>
      {number_changes > 0 ? (
        <div className="flex items-center justify-start gap-1">
          <ChevronUp className="h-6 w-6 text-green-500" />
          <span className="text-lg font-medium text-green-500">
            {number_changes}%
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-start gap-1">
          <ChevronDown className="h-6 w-6 text-red-500" />
          <span className="text-lg font-medium text-red-500">
            {Math.abs(number_changes)}%
          </span>
        </div>
      )}
    </div>
  )
}
