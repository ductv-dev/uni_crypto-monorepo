export type NotificationStatus = "success" | "failed"

export type NotificationEvent =
  | "order.place"
  | "order.matched"
  | "deposit.request"
  | "withdraw.request"
  | "deposit.approved"
  | "deposit.rejected"
  | "withdraw.approved"
  | "withdraw.rejected"

export type UserRealtimeNotificationPayload = {
  id: string
  userId: string
  event: NotificationEvent
  status: NotificationStatus
  title: string
  message: string
  createdAt: string
  read?: boolean
  metadata?: Record<string, unknown>
}

export type UserNotificationItem = UserRealtimeNotificationPayload & {
  read: boolean
}
