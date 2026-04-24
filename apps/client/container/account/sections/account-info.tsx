import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Mail, Phone, User2 } from "lucide-react"
import { InfoRow } from "../components/info-row"

type AccountInfoProps = {
  user: {
    id: string
    email?: string
    phone?: string
  }
  onCopy: () => void
}

export const AccountInfo = ({ user, onCopy }: AccountInfoProps) => {
  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg">Thông tin liên lạc</CardTitle>
        <CardDescription>
          Các thông tin cơ bản dùng để xác thực và liên lạc với bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <InfoRow
          icon={<User2 className="size-5" />}
          label="ID người dùng"
          value={user.id}
          onCopy={onCopy}
        />
        <InfoRow
          icon={<Mail className="size-5" />}
          label="Email liên kết"
          value={user.email || "Chưa cập nhật"}
        />
        <InfoRow
          icon={<Phone className="size-5" />}
          label="Số điện thoại"
          value={user.phone || "Chưa cập nhật"}
        />
      </CardContent>
    </Card>
  )
}
