import {
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type BackendNotificationsResponse,
} from "@/lib/api/notifications"
import { useNotificationStore } from "@/store/notification-store"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type NotificationsQuery = {
  page?: number
  limit?: number
}

export const NOTIFICATIONS_QUERY_KEY = ["notifications"]

export const useNotifications = (query: NotificationsQuery = {}) => {
  return useQuery<BackendNotificationsResponse, Error>({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, query.page ?? 1, query.limit ?? 20],
    queryFn: () => getUserNotifications(query),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
  })
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()
  const markAsRead = useNotificationStore((state) => state.markAsRead)

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (notification) => {
      markAsRead(notification.id)
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead)

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      markAllAsRead()
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}
