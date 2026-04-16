import { cn } from "@/lib/utils/utils"
import { ChevronRight } from "lucide-react"

type Props = {
  className?: string
  title: string
  description: string
  icon: React.ReactNode
  action?: React.ReactNode
}
export const ButtonSetting: React.FC<Props> = ({
  className,
  title,
  description,
  icon,
  action,
  ...props
}) => {
  return (
    <button
      className={cn(
        "group/item flex w-full cursor-pointer items-center gap-3 rounded-xl bg-card p-4 text-sm font-medium text-foreground transition-all focus-visible:outline-none active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-primary-foreground">
        {icon}
      </div>
      <div className="flex flex-1 flex-col items-start gap-0.5">
        <span className="line-clamp-1 text-sm font-semibold">{title}</span>
        <span className="line-clamp-1 text-left text-xs font-normal text-muted-foreground">
          {description}
        </span>
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover/item:translate-x-0.5" />
    </button>
  )
}
