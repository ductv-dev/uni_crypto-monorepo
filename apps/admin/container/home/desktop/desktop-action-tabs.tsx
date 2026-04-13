"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { FormBuySell } from "../forms/form-buy-sell"
import { FormReceive } from "../forms/form-receive"
import { FormSend } from "../forms/form-send"
import { FormSwap } from "../forms/form-swap"

export const DesktopActionTabs = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <Tabs defaultValue="swap">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="swap" className="flex-1">
            Swap
          </TabsTrigger>
          <TabsTrigger value="buy-sell" className="flex-1">
            Mua / Bán
          </TabsTrigger>
          <TabsTrigger value="receive" className="flex-1">
            Nhận
          </TabsTrigger>
          <TabsTrigger value="send" className="flex-1">
            Gửi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="swap" className="mt-0">
          <FormSwap />
        </TabsContent>
        <TabsContent value="buy-sell" className="mt-0">
          <FormBuySell />
        </TabsContent>
        <TabsContent value="receive" className="mt-0 pt-2">
          <FormReceive />
        </TabsContent>
        <TabsContent value="send" className="mt-0 pt-2">
          <FormSend />
        </TabsContent>
      </Tabs>
    </div>
  )
}
