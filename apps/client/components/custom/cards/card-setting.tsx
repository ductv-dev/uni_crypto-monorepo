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
    <div
      onClick={() => !disabled && onClick?.()}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 p-2.5 text-foreground/60 hover:bg-accent",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <div className="rounded-lg bg-accent p-2.5">{icon}</div>

      <p className="flex-1 text-start text-lg font-semibold">{title}</p>
      <div className="flex items-center justify-center gap-2.5">
        {description && <p className="text-foreground/60">{description}</p>}
        <ChevronRight size={24} className="text-foreground/60" />
      </div>
    </div>
  )
}
