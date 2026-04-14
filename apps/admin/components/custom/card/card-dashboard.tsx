"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

type Props = {
  data: TCardDashboardProps
}
type TCardDashboardProps = {
  title: string
  icon: React.ReactNode
  items: { title: string; value: string; unit?: string }[]
}
export const CardDashboard: React.FC<Props> = ({ data }) => {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const isDark = mounted
    ? (theme === "system" ? systemTheme : theme) === "dark"
    : true
  return (
    <Card className="w-full max-w-sm border-none p-0 shadow-none">
      <CardHeader className="pt-4">
        <CardTitle>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground/90">
                {data.title}
              </span>
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                Overview
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
              {data.icon}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {data.items?.map((subItem, index) => (
          <div key={index} className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground/80">
                {subItem.title}
              </span>
              {subItem.unit && (
                <span className="text-xs font-medium text-muted-foreground/80">
                  ({subItem.unit})
                </span>
              )}
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {subItem.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
