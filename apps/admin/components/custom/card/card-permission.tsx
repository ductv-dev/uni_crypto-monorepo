import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type Props = {
  name: string
  description: string
  actions: string[]
}

export const CardPermission = ({ name, description, actions }: Props) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start justify-between">
        <CardTitle>{name}</CardTitle>
        <span className="text-sm">{description}</span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              {actions.map((action) => {
                return <Badge key={action}>{action}</Badge>
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
