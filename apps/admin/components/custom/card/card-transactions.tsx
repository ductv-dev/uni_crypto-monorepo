import { TOverView } from "@/hooks/transactions/use-transactions-overview"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeDollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
type Props = {
  data: TOverView
}

export const CardTransactions: React.FC<Props> = ({ data }) => {
  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case "deposit":
        return <ArrowDownToLine className="h-4 w-4 text-blue-500" />
      case "withdraw":
        return <ArrowUpFromLine className="h-4 w-4 text-orange-500" />
      case "buy":
        return <ShoppingCart className="h-4 w-4 text-green-500" />
      case "sell":
        return <BadgeDollarSign className="h-4 w-4 text-red-500" />
      default:
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />
    }
  }
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">
          Total {data.title}
        </CardTitle>
        {getIcon(data.title)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${data.amount.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground">
          {data.total} transactions
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-medium tracking-wider uppercase">
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {data.success} Success
          </div>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {data.failed} Failed
          </div>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {data.processing} Process
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {data.rejected} Reject
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
