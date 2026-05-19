import {
  type UserNotificationItem,
  type UserRealtimeNotificationPayload,
} from "@/types/notification"
import { create } from "zustand"

type NotificationStore = {
  notifications: UserNotificationItem[]
  setNotifications: (payload: UserNotificationItem[]) => void
  addNotification: (payload: UserRealtimeNotificationPayload) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const MAX_NOTIFICATION_ITEMS = 30
const sortNotifications = (items: UserNotificationItem[]) =>
  [...items].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  )

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (payload) =>
    set(() => ({
      notifications: sortNotifications(payload).slice(
        0,
        MAX_NOTIFICATION_ITEMS
      ),
    })),
  addNotification: (payload) =>
    set((state) => {
      const id = `${payload.event}-${payload.createdAt}-${Math.random().toString(16).slice(2)}`
      const nextItem: UserNotificationItem = {
        ...payload,
        id: payload.id || id,
        read: payload.read ?? false,
      }
      const deduped = state.notifications.filter(
        (item) => item.id !== nextItem.id
      )

      return {
        notifications: sortNotifications([nextItem, ...deduped]).slice(
          0,
          MAX_NOTIFICATION_ITEMS
        ),
      }
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({
        ...item,
        read: true,
      })),
    })),
  clearNotifications: () => set({ notifications: [] }),
}))
