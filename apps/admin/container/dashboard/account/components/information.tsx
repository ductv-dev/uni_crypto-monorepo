import { ButtonSetting } from "@/components/custom/buttons/card-setting-admin"
import { TAdmin } from "@/types"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { LockKeyholeIcon, Mail, Phone, UserKey } from "lucide-react"

type Props = {
  admin: TAdmin
}
export const Information: React.FC<Props> = ({ admin }) => {
  return (
    <Card className="">
      <CardHeader className="relative flex flex-row justify-center">
        <Avatar className="h-24 w-24 rounded-full border-2 border-muted shadow-sm">
          <AvatarImage src={admin.avatar} alt={admin.name} />
          <AvatarFallback className="rounded-full">
            {admin.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </CardHeader>

      <CardContent>
        <ButtonSetting
          icon={<UserKey size={20} />}
          title="Passkey (Thông tin sinh trắc học)"
          description="Bảo vệ tài khoản và khoản tiền được rút bằng Mã xác thực và/hoặc khóa bảo mật như Yubikey"
        />
        <ButtonSetting
          icon={<Mail size={20} />}
          title="Email"
          description={admin.email}
        />
        <ButtonSetting
          icon={<Phone size={20} />}
          title="Số điện thoại"
          description={admin.phone}
        />
        <ButtonSetting
          icon={<LockKeyholeIcon size={20} />}
          title="Mật khẩu đăng nhập"
          description="Thay đổi mật khẩu đăng nhập của bạn"
        />
      </CardContent>
    </Card>
  )
}
