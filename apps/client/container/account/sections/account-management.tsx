import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Pen, ShieldCheck, Wallet2 } from "lucide-react"
import { ActionRow } from "../components/action-row"

type AccountManagementProps = {
  onGoToWallets: () => void
  onGoToSettings: () => void
  onOpenNameDrawer: () => void
}

export const AccountManagement = ({
  onGoToWallets,
  onGoToSettings,
  onOpenNameDrawer,
}: AccountManagementProps) => {
  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg">Quản lý tài khoản</CardTitle>
        <CardDescription>
          Các thao tác thường dùng để quản lý profile và ví.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ActionRow
          icon={<Wallet2 className="size-5" />}
          title="Quản lý ví"
          description="Xem danh sách ví, số dư và tài sản đang nắm giữ."
          onClick={onGoToWallets}
        />
        <ActionRow
          icon={<ShieldCheck className="size-5" />}
          title="Cài đặt tài khoản"
          description="Đi tới phần cài đặt để thay đổi tuỳ chọn hệ thống."
          onClick={onGoToSettings}
        />
        <ActionRow
          icon={<Pen className="size-5" />}
          title="Cập nhật tên hiển thị"
          description="Đổi tên sẽ được áp dụng ngay trên hồ sơ của bạn."
          onClick={onOpenNameDrawer}
        />
      </CardContent>
    </Card>
  )
}
