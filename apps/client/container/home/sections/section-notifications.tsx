import { CardNotification } from "@/components/custom/cards/card-notification"
import { type UserNotificationItem } from "@/types/notification"
import { Bell, CircleAlert, CircleCheck } from "lucide-react"

const getNotificationIcon = (status: "success" | "failed") =>
  status === "failed" ? (
    <CircleAlert strokeWidth={2.2} size={20} />
  ) : (
    <CircleCheck strokeWidth={2.2} size={20} />
  )

type Props = {
  notifications?: UserNotificationItem[]
  onMarkRead?: (id: string, read: boolean) => void
}

export const SectionNotifications: React.FC<Props> = ({
  notifications,
  onMarkRead,
}) => {
  const data = notifications || []
  const unreadNotifications = data.filter((noti) => !noti.read)

  const handleSetNotification = (id: string, read: boolean) =>
    onMarkRead?.(id, read)

  if (unreadNotifications.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col md:gap-2">
      <div className="hidden items-center justify-between px-1 md:flex">
        <p className="text-xs font-semibold tracking-wider text-foreground/40 uppercase">
          Thông báo
        </p>
        <a
          href="/user/notifications"
          className="text-xs font-medium text-primary transition-opacity hover:opacity-80"
        >
          Xem tất cả
        </a>
      </div>
      <div className="no-scrollbar flex w-full gap-2.5 overflow-x-auto py-5 md:gap-3 md:py-0 md:pb-1">
        {unreadNotifications.map((noti) => (
          <CardNotification
            key={noti.id}
            title={noti.title}
            description={noti.message}
            icon={
              noti.status === "success" || noti.status === "failed" ? (
                getNotificationIcon(noti.status)
              ) : (
                <Bell strokeWidth={2.2} size={20} />
              )
            }
            isRequired={false}
            setNotification={(read: boolean) =>
              handleSetNotification(noti.id, read)
            }
          />
        ))}
      </div>
    </div>
  )
}
