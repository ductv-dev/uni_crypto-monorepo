import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import "@workspace/ui/globals.css"

import { cn } from "@/lib/utils/utils"
import Providers from "@/provider/query-provider"
import { Toaster } from "@workspace/ui/index"

export const metadata: Metadata = {
  title: "Uni",
  description: "Unified Crypto Wallet & Exchange",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Uni",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Providers>
            <div className="max-w-screen">
              <div className="mx-auto max-w-7xl">{children}</div>
            </div>
          </Providers>
        </ThemeProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
