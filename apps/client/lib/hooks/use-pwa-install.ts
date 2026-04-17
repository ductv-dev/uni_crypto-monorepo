"use client"

import { useEffect, useState } from "react"

//Khai báo type cho beforeinstallprompt event
type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Để tránh lỗi setState đồng bộ, sử dụng timeout hoặc requestAnimationFrame
    // Mặc định là true để nút hiển thị ngay cả trên iOS hoặc Dev mode
    let initialInstallable = true
    if (window.matchMedia("(display-mode: standalone)").matches) {
      initialInstallable = false
    }

    // Cập nhật state sau khi layout đã render xong
    setTimeout(() => {
      setIsInstallable(initialInstallable)
    }, 0)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      )
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) {
      // Fallback cho iOS Safari hoặc khi dev server chưa phát event
      alert(
        "Để cài đặt ứng dụng: \n\n1. Nhấn vào biểu tượng Chia sẻ (Share) trên điện thoại\n2. Chọn 'Thêm vào màn hình chính' (Add to Home Screen)."
      )
      return
    }

    // Hiển thị prompt cài đặt
    await deferredPrompt.prompt()

    // Chờ người dùng phản hồi prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstallable(false)
    }

    setDeferredPrompt(null)
  }

  return { isInstallable, install }
}
