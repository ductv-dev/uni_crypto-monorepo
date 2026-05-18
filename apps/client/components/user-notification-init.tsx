"use client"

import { useMe } from "@/hooks/auth/use-me"
import { useNotificationStore } from "@/store/notification-store"
import { type UserRealtimeNotificationPayload } from "@/types/notification"
import { toast } from "@workspace/ui/index"
import { useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3002"

const isValidPayload = (
  payload: unknown
): payload is UserRealtimeNotificationPayload => {
  if (!payload || typeof payload !== "object") {
    return false
  }

  const candidate = payload as Partial<UserRealtimeNotificationPayload>
  return (
    typeof candidate.userId === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.event === "string" &&
    typeof candidate.status === "string"
  )
}

export function UserNotificationInit() {
  const socketRef = useRef<Socket | null>(null)
  const { data: currentUser, isSuccess } = useMe()
  const addNotification = useNotificationStore((state) => state.addNotification)

  useEffect(() => {
    if (!isSuccess || !currentUser?.id) {
      return
    }

    const socket = io(WS_URL, {
      transports: ["websocket"],
      reconnection: true,
      auth: {
        userId: currentUser.id,
      },
    })

    socketRef.current = socket

    socket.on("connect", () => {
      socket.emit("notification.join", { userId: currentUser.id })
    })

    socket.on("user.notification", (payload: unknown) => {
      if (!isValidPayload(payload)) {
        return
      }

      addNotification({
        ...payload,
        createdAt: payload.createdAt || new Date().toISOString(),
      })

      if (payload.status === "failed") {
        toast.error(payload.message || payload.title)
        return
      }

      toast.success(payload.message || payload.title)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [addNotification, currentUser?.id, isSuccess])

  return null
}
