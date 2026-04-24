import { Coins, LayoutGrid, Wallet } from "lucide-react"
import { StatCard } from "../components/stat-card"

type AccountStatsProps = {
  totalBalance: number
  walletCount: number
  tokenCount: number
}

export const AccountStats = ({
  totalBalance,
  walletCount,
  tokenCount,
}: AccountStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Tổng tài sản ước tính"
        value={`$${totalBalance.toLocaleString()}`}
        icon={<Coins className="size-4" />}
      />
      <StatCard
        title="Số ví đang quản lý"
        value={walletCount}
        icon={<Wallet className="size-4" />}
      />
      <StatCard
        title="Số lượng token"
        value={tokenCount}
        icon={<LayoutGrid className="size-4" />}
      />
    </div>
  )
}
