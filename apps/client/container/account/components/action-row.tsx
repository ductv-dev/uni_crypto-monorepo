import { ChevronRight } from "lucide-react"
import { type ReactNode } from "react"

type ActionRowProps = {
  icon: ReactNode
  title: string
  description: string
  className?: string
  onClick?: () => void
}

export const ActionRow = ({
  icon,
  title,
  description,
  className,
  onClick,
}: ActionRowProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 text-left transition-colors hover:bg-accent ${className ?? ""}`}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-foreground/70">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="size-5 text-muted-foreground" />
    </button>
  )
}
