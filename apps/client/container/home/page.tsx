"use client"
import { useTokens } from "@/lib/hooks"
import { useUser } from "@/store/user-store"
import { Wallet } from "lucide-react"
import { useState } from "react"
import { TUser } from "@workspace/shared/types"
import { DesktopActionTabs } from "./desktop/desktop-action-tabs"
import { SectionAccount } from "./sections/section-account"
import { SectionAction } from "./sections/section-action"
import { SectionBalance } from "./sections/section-balance"
import { SectionListToken } from "./sections/section-list-token"
import { SectionNotifications } from "./sections/section-notifications"

export const Home = () => {
  const user = useUser((state: { user: TUser }) => state.user)
  const { data: tokens, isLoading, isError } = useTokens()
  const displayTokens = (tokens ?? []).slice(0, 8)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nhận token đầu tiên của bạn",
      description:
        "Hãy nhận token đầu tiên của bạn để bắt đầu hành trình khám phá thế giới DeFi!",
      icon: <Wallet strokeWidth={3} size={20} />,
      is_repuired: true,
      read: false,
    },
    {
      id: 2,
      title: "Thiết lập tên người dùng",
      description:
        "Hãy thiết lập tên người dùng của bạn để hoàn thành quá trình đăng ký!",
      icon: <Wallet strokeWidth={3} size={20} />,
      is_repuired: false,
      read: false,
    },
  ])

  const totalBalance = 10032432
  const numberChanges = 2.2
  return (
    <div className="w-full">
      {/* ── Mobile ── */}
      <div className="md:hidden">
        <SectionAccount data={user} />
        <SectionBalance
          number_changes={numberChanges}
          total_balance={totalBalance}
        />
        <SectionAction />
        <SectionNotifications
          notifications={notifications}
          onMarkRead={(id, read) =>
            setNotifications((prev) =>
              prev.map((item) => (item.id === id ? { ...item, read } : item))
            )
          }
        />
        <SectionListToken
          isLoading={isLoading}
          isError={isError}
          data={displayTokens}
        />
      </div>

      {/* ── Desktop ── */}
      <div className="mx-auto hidden w-full max-w-7xl gap-6 px-6 py-8 md:flex">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <SectionBalance
            number_changes={numberChanges}
            total_balance={totalBalance}
            isDesktop
          />
          <SectionNotifications
            notifications={notifications}
            onMarkRead={(id, read) =>
              setNotifications((prev) =>
                prev.map((item) => (item.id === id ? { ...item, read } : item))
              )
            }
          />

          <SectionListToken
            isLoading={isLoading}
            isError={isError}
            data={displayTokens}
            isDesktop
          />
        </div>

        <div className="w-[380px] shrink-0">
          <div className="sticky top-24">
            <DesktopActionTabs />
          </div>
        </div>
      </div>
    </div>
  )
}
