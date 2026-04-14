import { CardHistory } from "@/components/custom/card/card-history"
import { THistory } from "@/types/history.type"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type Props = {
  data: THistory[]
}
export const History: React.FC<Props> = ({ data }) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[250px] overflow-y-auto">
        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <CardHistory key={item.id} {...item} />
          ))}
        </div>{" "}
      </CardContent>
    </Card>
  )
}
