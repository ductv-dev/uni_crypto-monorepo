import { cn } from "@/lib/utils/utils"
import { Icons } from "@workspace/ui/components/icons"

type TTriggerButton = {
  icon: keyof typeof Icons
  title?: string
  className?: string
}
export const TriggerButton: React.FC<TTriggerButton> = ({
  icon,
  title,
  className,
}) => {
  const Icon = Icons[icon]

  return (
    <div
      className={cn(
        "flex max-w-50 flex-col items-start gap-2.5 rounded-xl border-none bg-primary/20 p-4",
        className
      )}
    >
      {Icon ? <Icon className="h-5 w-5 text-primary" /> : <span>{icon}</span>}
      {title && (
        <p className="text-start text-sm font-semibold text-primary">{title}</p>
      )}
    </div>
  )
}
