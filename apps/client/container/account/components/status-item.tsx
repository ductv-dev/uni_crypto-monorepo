import { CheckCircle2, Circle } from "lucide-react"

type StatusItemProps = {
  label: string
  description: string
  complete: boolean
}

export const StatusItem = ({
  label,
  description,
  complete,
}: StatusItemProps) => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/50 p-4">
      <div className="mt-0.5 shrink-0">
        {complete ? (
          <CheckCircle2 className="size-5 text-emerald-500" />
        ) : (
          <Circle className="size-5 text-muted-foreground" />
        )}
      </div>
      <div className="space-y-0.5">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
