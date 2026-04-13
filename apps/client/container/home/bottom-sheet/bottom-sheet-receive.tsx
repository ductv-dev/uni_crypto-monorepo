"use client"

import { TriggerButton } from "@/components/custom/button/trigger-button"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { FormReceive } from "../forms/form-receive"

export const BottomSheetReceive = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <TriggerButton className="w-30" icon="import" title="Nhận" />
      </DrawerTrigger>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader>
          <DrawerTitle className="h-0 text-start text-lg font-medium opacity-0">
            Nhận
          </DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar w-full overflow-y-auto px-4 pb-12">
          <FormReceive />
          <DrawerClose asChild>
            <div className="mt-8 cursor-pointer text-center text-sm font-semibold text-foreground/60 transition-colors">
              Đóng
            </div>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
