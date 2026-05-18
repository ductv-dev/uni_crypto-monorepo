import {
  type UserNotificationItem,
  type UserRealtimeNotificationPayload,
} from "@/types/notification"
import { create } from "zustand"

type NotificationStore = {
  notifications: UserNotificationItem[]
  addNotification: (payload: UserRealtimeNotificationPayload) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
}

const MAX_NOTIFICATION_ITEMS = 30

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (payload) =>
    set((state) => {
      const id = `${payload.event}-${payload.createdAt}-${Math.random().toString(16).slice(2)}`
      const nextItem: UserNotificationItem = {
        ...payload,
        id,
        read: false,
      }

      return {
        notifications: [nextItem, ...state.notifications].slice(
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
  clearNotifications: () => set({ notifications: [] }),
}))
