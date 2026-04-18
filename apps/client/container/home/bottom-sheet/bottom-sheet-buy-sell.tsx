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
import { TToken } from "@workspace/shared/types"
import { FormBuySell } from "../forms/form-buy-sell"

type Props = {
  className?: string
  defaultTokenSymbol?: TToken["symbol"]
  trigger?: React.ReactNode
}

export const BottomSheetBuySell: React.FC<Props> = ({ className, trigger }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        {trigger ?? (
          <button type="button">
            <TriggerButton
              className={cn("w-30", className)}
              icon="bank"
              title="Mua/Bán"
            />
          </button>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-[90%] max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle className="h-0 text-center font-medium opacity-0">
            Mua / Bán
          </DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 pb-12">
          <FormBuySell onSuccess={() => setDrawerOpen(false)} />
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
