import { ButtonSetting } from "@/components/custom/buttons/card-setting-admin"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { HistoryIcon, MonitorSmartphone } from "lucide-react"

export const DeviceManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Thiết bị và hoạt động</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2.5">
          <ButtonSetting
            icon={<MonitorSmartphone size={20} />}
            title="Quản lý thiết bị"
            description="Xem và quản lý các thiết bị đã đăng nhập vào tài khoản của bạn"
          />
          <ButtonSetting
            icon={<MonitorSmartphone size={20} />}
            title="Lịch sử đăng nhập"
            description="Xem lịch sử đăng nhập của bạn"
          />
          <ButtonSetting
            icon={<HistoryIcon size={20} />}
            title="Lịch sử hoạt động"
            description="Xem lịch sử hoạt động của bạn"
          />
        </div>
      </CardContent>
    </Card>
  )
}
