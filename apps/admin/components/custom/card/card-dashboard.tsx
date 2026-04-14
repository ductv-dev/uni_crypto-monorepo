import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { MoveDownRight, TrendingUp } from "lucide-react"

type Props = {
  data: TCardDashboardProps
}
type TCardDashboardProps = {
  title: string
  icon: React.ReactNode
  items: { title: string; value: string; trend: number }[]
}
export const CardDashboard: React.FC<Props> = ({ data }) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          <div className="flex items-center gap-2">
            <div>{data.icon}</div>
            <div>{data.title}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {data.items?.map((subItem, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2">
              <div>{subItem.title}</div>
              <div>{subItem.value}</div>
            </div>
            {subItem.trend > 0 ? (
              <Badge variant="outline" className="bg-green-500">
                <TrendingUp className="size-2" />
                {subItem.trend}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500">
                <MoveDownRight className="size-2" />
                {subItem.trend}
              </Badge>
            )}
          </div>
        ))}
      </CardFooter>
    </Card>
  )
}
