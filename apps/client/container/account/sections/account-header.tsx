import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Copy, Pen, ShieldCheck, Sparkles } from "lucide-react"

type AccountHeaderProps = {
  user: {
    name: string
    avatar?: string
  }
  shortID: string
  completedStatusCount: number
  totalStatusCount: number
  onCopy: () => void
  onOpenNameDrawer: () => void
}

export const AccountHeader = ({
  user,
  shortID,
  completedStatusCount,
  totalStatusCount,
  onCopy,
  onOpenNameDrawer,
}: AccountHeaderProps) => {
  return (
    <Card className="relative overflow-hidden border-primary/10 bg-card shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_28%)]" />

      <CardContent className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-20 ring-4 ring-background/90 sm:size-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl font-semibold">
              {user.name.charAt(0) || "U"}
            </AvatarFallback>
            <AvatarBadge className="bg-emerald-500 text-white">
              <ShieldCheck />
            </AvatarBadge>
          </Avatar>

          <div className="space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Hồ sơ cá nhân
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {user.name}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Quản lý thông tin tài khoản, ví và mức độ hoàn thiện hồ sơ.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground">
                {shortID}
              </div>
              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                {completedStatusCount}/{totalStatusCount} mục đã hoàn tất
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:min-w-56">
          <Button className="w-full gap-2 sm:w-auto" onClick={onOpenNameDrawer}>
            <Pen className="size-4" />
            Chỉnh sửa tên hiển thị
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={onCopy}
          >
            <Copy className="size-4" />
            Sao chép ID
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
