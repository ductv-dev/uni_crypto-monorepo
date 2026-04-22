"use client"

import { TWalletOverView } from "@/hooks/system-wallet/use-wallet-system-overview"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Coins,
  Landmark,
  ShieldCheck,
  WalletCards,
  type LucideIcon,
} from "lucide-react"

type Props = {
  data: TWalletOverView
}

const formatBalance = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value)
}

const getWalletMeta = (
  wallet: TWalletOverView["wallet"]
): {
  title: string
  icon: LucideIcon
  iconClassName: string
} => {
  switch (wallet) {
    case "hot":
      return {
        title: "Hot Wallets",
        icon: WalletCards,
        iconClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      }
    case "cold":
      return {
        title: "Cold Wallets",
        icon: ShieldCheck,
        iconClassName:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      }
    case "treasury":
      return {
        title: "Treasury",
        icon: Landmark,
        iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      }
    case "fee":
      return {
        title: "Fee Wallets",
        icon: Coins,
        iconClassName: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      }
    default:
      return {
        title: wallet,
        icon: WalletCards,
        iconClassName: "bg-muted text-muted-foreground",
      }
  }
}

export const CardWalletSystemOverview: React.FC<Props> = ({ data }) => {
  const meta = getWalletMeta(data.wallet)
  const Icon = meta.icon

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">
              {meta.title}
            </CardTitle>
            <p className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">
              Asset balances
            </p>
          </div>
          <div className={`rounded-xl p-2.5 ${meta.iconClassName}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.total.map((asset) => (
          <div
            key={`${data.wallet}-${asset.asset}`}
            className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
          >
            <div className="text-sm font-medium">{asset.asset}</div>
            <div className="text-right">
              <div className="text-base font-semibold tabular-nums">
                {formatBalance(asset.total)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export const CardWalletSystemOverviewSkeleton: React.FC = () => {
  return <Skeleton className="h-[240px] w-full rounded-xl" />
}
