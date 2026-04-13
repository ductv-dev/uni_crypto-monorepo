"use client"

import { TriggerButton } from "@/components/custom/button/trigger-button"

import { cn } from "@/lib/utils/utils"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { useState } from "react"
import { FormSwap } from "../forms/form-swap"

type Props = {
  className?: string
  isMini: boolean
}

export const BottomSheetSwap: React.FC<Props> = ({
  className,
  isMini = false,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger>
        <TriggerButton
          className={cn("w-30", className)}
          icon="swap"
          title={isMini ? "" : "Swap Token"}
        />
      </DrawerTrigger>
      <DrawerContent className="h-[90%] max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle className="text-start text-lg font-medium">
            Swap
          </DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar w-full overflow-y-auto px-4 pb-12">
          <FormSwap onSuccess={() => setDrawerOpen(false)} />
          <DrawerClose asChild>
            <div className="mt-4 cursor-pointer text-center text-sm font-semibold text-foreground/60 transition-colors">
              Hủy
            </div>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
