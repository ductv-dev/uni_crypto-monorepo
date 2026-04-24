import { type ReactNode } from "react"

type StatCardProps = {
  title: string
  value: string | number
  icon: ReactNode
  className?: string
}

export const StatCard = ({ title, value, icon, className }: StatCardProps) => {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}
