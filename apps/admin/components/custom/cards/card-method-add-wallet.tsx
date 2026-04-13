import { cn } from "@/lib/utils/utils"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Icons } from "@workspace/ui/components/icons"

type Props = {
  className?: string
  title: string
  description: string
  icon: keyof typeof Icons
}

export const CardMethodAddWallet: React.FC<Props> = ({
  className,
  title,
  description,
  icon,
}) => {
  const Icon = Icons[icon]
  return (
    <Card className={cn("w-full max-w-sm cursor-pointer", className)}>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-2">
            <Icon />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
