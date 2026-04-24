import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Download, Mail, ShieldCheck } from "lucide-react"
import { ActionRow } from "../components/action-row"

type AccountSecurityProps = {
  onGoToSettings: () => void
  onLogout: () => void
}

export const AccountSecurity = ({
  onGoToSettings,
  onLogout,
}: AccountSecurityProps) => {
  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg">An toàn & truy cập</CardTitle>
        <CardDescription>
          Một vài thao tác nhanh liên quan đến việc bảo vệ tài khoản.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                Trạng thái hiện tại
              </p>
              <p className="text-sm text-muted-foreground">
                Tài khoản đã có email đăng nhập và ID định danh riêng.
              </p>
            </div>
          </div>
        </div>
        <ActionRow
          icon={<Mail className="size-5" />}
          title="Kiểm tra email đăng nhập"
          description="Đảm bảo email đang dùng là email bạn còn truy cập được."
          onClick={onGoToSettings}
        />
        <ActionRow
          icon={<Download className="size-5 text-red-500" />}
          title="Đăng xuất"
          description="Thoát khỏi phiên hiện tại và quay về màn hình chào."
          className="text-red-500"
          onClick={onLogout}
        />
      </CardContent>
    </Card>
  )
}
