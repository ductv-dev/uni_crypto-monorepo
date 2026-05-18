"use client"
import { useTokens } from "@/hooks"
import { useNotificationStore } from "@/store/notification-store"
import { useUser } from "@/store/user-store"
import { TUser } from "@workspace/shared/types"
import { DesktopActionTabs } from "./desktop/desktop-action-tabs"
import { SectionAccount } from "./sections/section-account"
import { SectionAction } from "./sections/section-action"
import { SectionBalance } from "./sections/section-balance"
import { SectionListToken } from "./sections/section-list-token"
import { SectionNotifications } from "./sections/section-notifications"

export const Home = () => {
  const user = useUser((state: { user: TUser }) => state.user)
  const notifications = useNotificationStore((state) => state.notifications)
  const markAsRead = useNotificationStore((state) => state.markAsRead)
  const { data: tokens, isLoading, isError } = useTokens()
  const displayTokens = (tokens ?? []).slice(0, 8)

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
          onMarkRead={(id, read) => read && markAsRead(id)}
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
            onMarkRead={(id, read) => read && markAsRead(id)}
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
