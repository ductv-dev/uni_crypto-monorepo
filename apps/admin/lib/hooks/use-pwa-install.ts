"use client"

import { useState, useEffect } from "react"

// Extend Window interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
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
    // To avoid synchronous setState warning, we use a timeout or requestAnimationFrame
    // Default to true so the button shows up even on iOS or Dev mode
    let initialInstallable = true
    if (window.matchMedia("(display-mode: standalone)").matches) {
      initialInstallable = false
    }

    // schedule state update after layout
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

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstallable(false)
    }

    setDeferredPrompt(null)
  }

  return { isInstallable, install }
}
