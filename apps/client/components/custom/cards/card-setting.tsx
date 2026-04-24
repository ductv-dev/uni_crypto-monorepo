import { cn } from "@/lib/utils/utils"
import { ChevronRight } from "lucide-react"

type TCardSetting = {
  title: string
  description?: string
  icon: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export const CardSetting: React.FC<TCardSetting> = ({
  title,
  description,
  icon,
  className,
  onClick,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onClick?.()}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 text-left text-foreground transition-colors hover:bg-accent",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-foreground/70">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="mt-0.5 text-sm opacity-70">{description}</p>
        )}
      </div>
      <ChevronRight className="size-5 opacity-50" />
    </button>
  )
}
