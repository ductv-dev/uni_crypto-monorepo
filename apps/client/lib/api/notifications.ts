import { requestJson } from "@/lib/api/client"
import { type UserNotificationItem } from "@/types/notification"

export type BackendNotificationsResponse = {
  data: UserNotificationItem[]
  meta: {
    total: number
    unreadCount: number
    page: number
    limit: number
    totalPages: number
  }
}

type NotificationsQuery = {
  page?: number
  limit?: number
}

const buildNotificationQueryString = ({ page, limit }: NotificationsQuery) => {
  const searchParams = new URLSearchParams()

  if (page) {
    searchParams.set("page", String(page))
  }

  if (limit) {
    searchParams.set("limit", String(limit))
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

export const getUserNotifications = (query: NotificationsQuery = {}) =>
  requestJson<BackendNotificationsResponse>(
    `/api/proxy/notifications${buildNotificationQueryString(query)}`,
    {
      method: "GET",
      defaultErrorMessage: "Failed to load notifications",
    }
  )

export const markNotificationAsRead = (notificationId: string) =>
  requestJson<UserNotificationItem>(
    `/api/proxy/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      defaultErrorMessage: "Failed to mark notification as read",
    }
  )

export const markAllNotificationsAsRead = () =>
  requestJson<{ updatedCount: number }>("/api/proxy/notifications/read-all", {
    method: "PATCH",
    defaultErrorMessage: "Failed to mark all notifications as read",
  })
