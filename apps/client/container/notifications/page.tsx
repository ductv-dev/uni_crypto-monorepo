"use client"

import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks"
import { useNotificationStore } from "@/store/notification-store"
import { Bell, BellRing, CircleAlert, CircleCheck, Loader2 } from "lucide-react"

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

const getNotificationIcon = (status: "success" | "failed", read: boolean) => {
  if (status === "failed") {
    return (
      <CircleAlert
        strokeWidth={2.2}
        size={18}
        className={read ? "text-amber-500/70" : "text-amber-500"}
      />
    )
  }

  return (
    <CircleCheck
      strokeWidth={2.2}
      size={18}
      className={read ? "text-emerald-500/70" : "text-emerald-500"}
    />
  )
}

export const NotificationsPage = () => {
  const notifications = useNotificationStore((state) => state.notifications)
  const notificationsQuery = useNotifications({ page: 1, limit: 30 })
  const { mutate: markNotificationAsRead, isPending: isMarkingRead } =
    useMarkNotificationAsRead()
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead()

  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <section className="rounded-3xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-foreground/70">
                <BellRing size={18} />
                <span className="text-sm font-medium">Notification Center</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
                Thông báo của bạn
              </h1>
              <p className="mt-1 text-sm text-foreground/55">
                {unreadCount > 0
                  ? `Bạn đang có ${unreadCount} thông báo chưa đọc.`
                  : "Bạn đã đọc hết thông báo."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll || unreadCount === 0}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMarkingAll ? "Đang cập nhật..." : "Đánh dấu đã đọc tất cả"}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-4 shadow-sm md:p-5">
          {notificationsQuery.isLoading ? (
            <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-foreground/55">
              <Loader2 size={16} className="animate-spin" />
              Đang tải thông báo...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center text-foreground/55">
              <Bell size={24} />
              <div>
                <p className="font-medium text-foreground/70">
                  Chưa có thông báo
                </p>
                <p className="text-sm">
                  Các cập nhật về lệnh, nạp và rút sẽ hiện ở đây.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`rounded-2xl border px-4 py-4 transition-colors ${
                    notification.read
                      ? "border-border bg-background/60"
                      : "border-primary/20 bg-primary/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 gap-3">
                      <div className="mt-0.5 shrink-0">
                        {getNotificationIcon(
                          notification.status,
                          notification.read
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="line-clamp-1 text-sm font-semibold text-foreground md:text-base">
                            {notification.title}
                          </h2>
                          {!notification.read ? (
                            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                              Mới
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-foreground/65">
                          {notification.message}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground/45">
                          <span>{formatDateTime(notification.createdAt)}</span>
                          <span className="rounded-full bg-background px-2 py-1 tracking-wide uppercase">
                            {notification.event}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!notification.read ? (
                      <button
                        type="button"
                        onClick={() => markNotificationAsRead(notification.id)}
                        disabled={isMarkingRead}
                        className="shrink-0 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Đã đọc
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
