import { convertToVNTime } from "@/lib/utils/convert-to-VN-time"
import { THistory } from "@/types/history.type"
import { Card, CardContent } from "@workspace/ui/components/card"

export const CardHistory: React.FC<THistory> = ({ action, date }) => {
  return (
    <Card className="border-none ring-0 hover:bg-accent">
      <CardContent className="flex items-center justify-between border-none">
        <p>{action}</p>
        <p className="text-muted-foreground">{convertToVNTime(date)}</p>
      </CardContent>
    </Card>
  )
}
