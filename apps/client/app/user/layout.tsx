import { NavbarDesktop } from "@/components/layout/nav-bar-desktop"
import { Navbar } from "@/components/layout/nav-bar-mobile"
import { UserNotificationInit } from "@/components/user-notification-init"
import { NAVBAR_ITEMS } from "@/lib/utils/nav-config"

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full">
      <UserNotificationInit />
      <div className="md:hidden">
        <Navbar data={NAVBAR_ITEMS} />
      </div>
      <div className="hidden md:block">
        <NavbarDesktop data={NAVBAR_ITEMS} />
      </div>
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  )
}
