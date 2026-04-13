"use client"

import { CardSetting } from "@/components/custom/cards/card-setting"
import { usePwaInstall } from "@/lib/hooks/use-pwa-install"
import { AnimatedThemeToggler } from "@workspace/ui/components/animated-theme-toggler"
import { toast } from "@workspace/ui/index"

import { ChevronLeft, Download, Settings, User2 } from "lucide-react"
import { useRouter } from "next/navigation"

const LIST_SETTING = [
  {
    name: "Notifications",
    icon: <Settings size={16} strokeWidth={2} className="text-foreground/60" />,
  },
  {
    name: "Privacy",
    icon: <Settings size={16} strokeWidth={2} className="text-foreground/60" />,
  },
  {
    name: "Security",
    icon: <Settings size={16} strokeWidth={2} className="text-foreground/60" />,
  },
]

export const Setting = () => {
  const route = useRouter()
  const { isInstallable, install } = usePwaInstall()
  const handleLogout = () => {
    toast.success("Đăng xuất thành công")
    route.push("/wellcome")
  }
  return (
    <div>
      <div className="fixed top-2.5 w-full px-2.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => route.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full border-t border-border bg-background shadow-lg shadow-border hover:bg-accent"
          >
            <ChevronLeft strokeWidth={2} className="text-foreground/60" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-foreground/60">
            Settings
          </h1>
          <div className="">
            <AnimatedThemeToggler />
          </div>
        </div>
      </div>
      <div className="mt-24 flex flex-col gap-2 px-2.5">
        {isInstallable && (
          <CardSetting
            title="Install App"
            icon={
              <Download size={16} strokeWidth={2} className="text-primary" />
            }
            onClick={install}
            className="mx-auto rounded-lg border border-primary/20 bg-primary/50 text-primary hover:bg-primary/20"
          />
        )}
        {LIST_SETTING.map((setting) => (
          <CardSetting
            key={setting.name}
            title={setting.name}
            icon={setting.icon}
          />
        ))}
        <CardSetting
          className=""
          onClick={() => route.push("/user/account")}
          title="Account"
          icon={<User2 size={16} className="text-primary" strokeWidth={2} />}
        />

        <CardSetting
          className="text-red-500"
          onClick={() => handleLogout()}
          title="Đăng xuất"
          icon={<Download size={16} className="text-red-500" strokeWidth={2} />}
        />
      </div>
    </div>
  )
}
