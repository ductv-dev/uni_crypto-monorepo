"use client" // BẮT BUỘC — error boundary phải là Client Component

import { useEffect } from "react"
import { RefreshCw, Home } from "lucide-react"
import Link from "next/link"

type Props = {
  error: Error & { digest?: string }
  reset: () => void // Next.js tự inject prop này để retry
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    // TODO: gửi lỗi lên monitoring service (Sentry, Datadog, etc.)
    console.error("[App Error]", error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 p-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 shadow-lg">
        <span className="text-3xl">⚠️</span>
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Đã xảy ra lỗi</h1>
        <p className="max-w-sm text-sm text-foreground/60">
          {error.message || "Có lỗi không mong muốn xảy ra. Vui lòng thử lại."}
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-foreground/40">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
        >
          <RefreshCw size={14} />
          Thử lại
        </button>
        <Link
          href="/user/home"
          className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-all hover:bg-accent"
        >
          <Home size={14} />
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
