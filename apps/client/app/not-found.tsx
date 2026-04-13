import Link from "next/link"
import { Home, AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 p-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
        <AlertCircle size={36} className="text-primary" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          404 — Trang không tồn tại
        </h1>
        <p className="max-w-sm text-sm text-foreground/60">
          Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xóa.
        </p>
      </div>
      <Link
        href="/user/home"
        className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
      >
        <Home size={14} />
        Về trang chủ
      </Link>
    </div>
  )
}
