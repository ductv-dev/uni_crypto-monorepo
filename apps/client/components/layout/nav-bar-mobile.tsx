"use client"

import { BottomSheetSwap } from "@/container/home/bottom-sheet/bottom-sheet-swap"
import { usePathname } from "next/navigation"
import { TNavItem } from "@workspace/shared/types"

type Props = { data: TNavItem[] }

export const Navbar: React.FC<Props> = ({ data }) => {
  const currentPath = usePathname() || "/"

  return (
    <div className="fixed bottom-0 z-10 flex w-full justify-center px-2 pb-2.5 md:flex">
      <div className="flex w-full max-w-lg items-center gap-2.5">
        <div className="flex flex-1 items-center rounded-full bg-accent/40 p-1 shadow-lg backdrop-blur-2xl">
          {data.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-1 items-center justify-center rounded-full p-2 py-4 text-sm ${
                currentPath === item.href
                  ? "bg-background/10 text-primary shadow-2xl backdrop-blur-2xl"
                  : "text-foreground/60"
              } hover:bg-accent`}
            >
              {item.icon}
            </a>
          ))}
        </div>
        <BottomSheetSwap
          isMini={true}
          className="flex h-15 w-20 items-center justify-center rounded-full border-t border-primary/30 bg-primary/20 shadow-lg shadow-primary/50 backdrop-blur-2xl"
        />
      </div>
    </div>
  )
}
