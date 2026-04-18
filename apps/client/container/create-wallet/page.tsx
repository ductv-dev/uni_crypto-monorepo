"use client"

import { useUser } from "@/store/user-store"
import { Field } from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { toast } from "@workspace/ui/index"
import { ChevronLeft, Info, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { TUser } from "@workspace/shared/types"

export const CreateWallet = () => {
  const route = useRouter()
  const setName = useUser((state) => state.setName)
  const [newName, setNewName] = useState<TUser["name"]>("")

  const handleSetName = () => {
    if (!newName) {
      setName("Wallet 1")
      route.push("/user/home")
      toast.success("Vui lòng thiết lập tên người dùng!")
      return
    }
    setName(newName)
    toast.success("Đã lưu tên người dùng!")
    route.push("/user/home")
  }
  return (
    <div className="w-full py-12">
      {/* Header */}
      <div className="fixed top-2.5 w-full px-2.5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => route.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full border-t border-border bg-background shadow-lg shadow-border hover:bg-accent"
          >
            <ChevronLeft strokeWidth={2} className="text-foreground/60" />
          </button>
          <button className="flex h-12 items-center justify-center rounded-full border-t border-border bg-background px-4 shadow-lg shadow-border hover:bg-accent">
            <span className="font-semibold text-foreground/60">Bỏ qua</span>
          </button>
        </div>
      </div>
      {/* Phần nội dung chính */}
      <div className="mt-24 flex w-full flex-col items-center justify-center gap-12">
        <div className="flex flex-col items-center justify-center gap-2.5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border-t border-border bg-background text-primary shadow-lg shadow-border">
            <User strokeWidth={3} size={24} />
          </div>
          <h5 className="font-semibold text-foreground/60">
            Tạo tên người dùng của bạn
          </h5>
          <p className="text-sm text-foreground/60">
            Đây là địa chỉ cá nhân mọi người có thể gửi crypto đến
          </p>
        </div>
        <div>
          <Field>
            <InputGroup className="h-14 rounded-2xl">
              <InputGroupInput
                className="text-xl font-semibold text-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                placeholder="your-username"
                onChange={(e) => setNewName(e.currentTarget.value)}
                value={newName}
              />
              <InputGroupAddon align="inline-end">
                <p className="text-xl font-semibold text-foreground">
                  .uni.eth
                </p>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <div className="mt-2 flex w-full items-center justify-center gap-1 text-sm text-foreground/60">
            <p>0x000...0000</p>
            <Info size={16} strokeWidth={2} />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="fixed bottom-0 w-full px-2.5 pb-15">
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <button
            onClick={() => handleSetName()}
            className="flex h-14 items-center justify-center rounded-2xl border-t border-border bg-background px-4 shadow-lg shadow-border hover:bg-accent"
          >
            <span className="font-semibold text-foreground/60">Tiếp tục</span>
          </button>
        </div>
      </div>
    </div>
  )
}
