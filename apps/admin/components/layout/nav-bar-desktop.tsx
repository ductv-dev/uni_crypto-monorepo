"use client"
import { CardSetting } from "@/components/custom/cards/card-setting"
import { shortenHex } from "@/lib/utils/utils"
import { useUser } from "@/store/user-store"
import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { UserAvatar } from "@workspace/ui/components/user-avatar"
import { toast } from "@workspace/ui/index"

import { ArrowLeftRight, Copy, Settings, User2, Wallet } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { TNavItem, TUser } from "shared/src/types"

type Props = { data: TNavItem[] }
export const NavbarDesktop: React.FC<Props> = ({ data }) => {
  const currentPath = usePathname() || "/"
  const router = useRouter()
  const user = useUser((state: { user: TUser }) => state.user)
  const shortID = user?.id ? shortenHex(user.id) : ""
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.id)
      toast.success("Đã sao chép vào clipboard!", {
        duration: 2000,
        icon: <Copy size={16} strokeWidth={2} className="text-green-500" />,
      })
    } catch {
      toast.error("Failed to copy!")
    }
  }

  return (
    <header className="sticky top-0 z-50 hidden w-full bg-background/80 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        {/* ── Logo ── */}
        <a href="/user/home" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <ArrowLeftRight size={16} className="text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Uni <span className="text-primary">Crypto</span>
          </span>
        </a>

        {/* ── Nav links ── */}
        <nav className="flex items-center gap-1 rounded-full border border-border bg-accent/30 p-1 backdrop-blur-xl">
          {data?.map((item) => {
            const isActive = currentPath === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "border-t border-primary bg-background text-primary shadow-sm"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <span className={isActive ? "text-primary" : ""}>
                  {item.icon}
                </span>
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* ── Right: Swap + User ── */}
        <div className="flex items-center gap-3">
          {/* User avatar dropdown */}
          <Drawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            direction="right"
          >
            <DrawerTrigger asChild>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
                <UserAvatar src={user.avatar} size={36} />
              </div>
            </DrawerTrigger>
            <DrawerContent className="px-2.5">
              {/* Profile header */}
              <div className="mt-5 flex flex-col items-center justify-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <UserAvatar src={user.avatar} size={64} />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <p className="font-semibold text-foreground">{user?.name}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-foreground/50">{shortID}</p>
                    <button onClick={handleCopy}>
                      <Copy
                        size={14}
                        strokeWidth={1.5}
                        className="text-foreground/50"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <CardSetting
                onClick={() => {
                  setIsDrawerOpen(false)
                  router.push("/user/my-wallet")
                }}
                title="My Wallet"
                icon={<Wallet strokeWidth={3} size={20} />}
              />
              <CardSetting
                onClick={() => {
                  setIsDrawerOpen(false)
                  router.push("/user/account")
                }}
                title="Account"
                icon={<User2 strokeWidth={3} size={20} />}
              />
              <CardSetting
                onClick={() => {
                  setIsDrawerOpen(false)
                  router.push("/user/setting")
                }}
                title="Settings"
                icon={<Settings strokeWidth={3} size={20} />}
              />
            </DrawerContent>
          </Drawer>
          <AnimatedThemeToggler />
        </div>
      </div>
    </header>
  )
}
