"use client"

import { CardToken1 } from "@/components/custom/card/card-token-1"
import { useDataToken } from "@/hooks/use-data-token"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export const TopToken: React.FC = () => {
  const { data: tokenList = [] } = useDataToken()
  const data = tokenList.slice(0, 5)

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground/90">
            Top Token
          </CardTitle>
        </CardHeader>
        <div className="flex flex-col items-start justify-start gap-2">
          {data.map((token) => (
            <CardToken1 key={token.address} data={token} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
