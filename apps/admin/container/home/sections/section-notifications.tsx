import { CardNotification } from "@/components/custom/cards/card-notification"
import { Wallet } from "lucide-react"
import { useState } from "react"

type TNotification = {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  is_repuired: boolean
  read?: boolean
}

type Props = {
  notifications?: TNotification[]
  onMarkRead?: (id: number, read: boolean) => void
}

export const SectionNotifications: React.FC<Props> = ({
  notifications,
  onMarkRead,
}) => {
  const [internalNotifications, setInternalNotifications] = useState<
    TNotification[]
  >([
    {
      id: 1,
      title: "Nhận token đầu tiên của bạn",
      description:
        "Hãy nhận token đầu tiên của bạn để bắt đầu hành trình khám phá thế giới DeFi!",
      icon: <Wallet strokeWidth={3} size={20} />,
      is_repuired: true,
      read: false,
    },
    {
      id: 2,
      title: "Thiết lập tên người dùng",
      description:
        "Hãy thiết lập tên người dùng của bạn để hoàn thành quá trình đăng ký!",
      icon: <Wallet strokeWidth={3} size={20} />,
      is_repuired: false,
      read: false,
    },
  ])

  const data = notifications || internalNotifications
  const unreadNotifications = data.filter((noti) => !noti.read)

  const handleSetNotification = (id: number, read: boolean) => {
    if (onMarkRead) {
      onMarkRead(id, read)
    } else {
      setInternalNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read } : item))
      )
    }
  }

  if (unreadNotifications.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col md:gap-2">
      <p className="hidden px-1 text-xs font-semibold tracking-wider text-foreground/40 uppercase md:block">
        Thông báo
      </p>
      <div className="no-scrollbar flex w-full gap-2.5 overflow-x-auto py-5 md:gap-3 md:py-0 md:pb-1">
        {unreadNotifications.map((noti) => (
          <CardNotification
            key={noti.id}
            title={noti.title}
            description={noti.description}
            icon={noti.icon}
            isRequired={noti.is_repuired}
            setNotification={(read: boolean) =>
              handleSetNotification(noti.id, read)
            }
          />
        ))}
      </div>
    </div>
  )
}
