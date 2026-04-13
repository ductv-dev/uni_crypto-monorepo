"use client"

import { useEffect } from "react"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[Global Error]", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100svh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            padding: "1.5rem",
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: "3rem" }}>💥</span>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
            Lỗi hệ thống nghiêm trọng
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#888",
              margin: 0,
              textAlign: "center",
            }}
          >
            Ứng dụng gặp sự cố không thể khôi phục.
            {error.digest && ` (ID: ${error.digest})`}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "9999px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  )
}
