import { Copy } from "lucide-react"
import { type ReactNode } from "react"

type InfoRowProps = {
  icon: ReactNode
  label: string
  value: string
  onCopy?: () => void
}

export const InfoRow = ({ icon, label, value, onCopy }: InfoRowProps) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-foreground/70">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate font-medium text-foreground">{value}</p>
      </div>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Copy className="size-4" />
        </button>
      )}
    </div>
  )
}
