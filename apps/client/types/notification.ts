export type NotificationStatus = "success" | "failed"

export type NotificationEvent =
  | "order.place"
  | "deposit.request"
  | "withdraw.request"
  | "deposit.approved"
  | "deposit.rejected"
  | "withdraw.approved"
  | "withdraw.rejected"

export type UserRealtimeNotificationPayload = {
  userId: string
  event: NotificationEvent
  status: NotificationStatus
  title: string
  message: string
  createdAt: string
  metadata?: Record<string, unknown>
}

export type UserNotificationItem = UserRealtimeNotificationPayload & {
  id: string
  read?: boolean
}
