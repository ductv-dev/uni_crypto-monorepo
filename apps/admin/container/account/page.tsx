"use client"

import { CardSetting } from "@/components/custom/cards/card-setting"
import { shortenHex } from "@/lib/utils/utils"
import { useUser } from "@/store/user-store"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/index"
import { Copy, Download, Pen, ShieldCheck, User2 } from "lucide-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { TUser } from "shared/src/types"

export const Account = () => {
  const user = useUser((state: { user: TUser }) => state.user)
  const setName = useUser(
    (state: { setName: (name: string) => void }) => state.setName
  )
  const route = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [name, setNameValue] = useState(user.name)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user.id)
      toast.success("Đã sao chép vào clipboard!", {
        duration: 2000,
        className: "",
        icon: <Copy size={16} strokeWidth={2} className="text-green-500" />,
      })
    } catch (err) {
      console.log(err)
      toast.error("Failed to copy to clipboard!")
    }
  }

  const handleEditName = () => {
    const nextName = name.trim()

    if (!nextName) {
      toast.error("Tên không được để trống")
      return
    }

    setName(nextName)
    setNameValue(nextName)
    setDrawerOpen(false)
    toast.success("Đã cập nhật tên")
  }

  const shortID = shortenHex(user.id)

  return (
    <div className="w-full p-2.5">
      <div className="flex items-center justify-center py-2.5">
        <h2 className="text-xl font-semibold">Thông tin tài khoản</h2>
      </div>
      <div className="flex flex-col gap-2.5">
        <Card>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user?.name.charAt(0) || "U"}</AvatarFallback>
                  <AvatarBadge className="right-0 bottom-0 size-10">
                    <ShieldCheck />
                  </AvatarBadge>
                </Avatar>

                <p className="font-semibold text-foreground/60">{user.name}</p>
                <Drawer
                  open={drawerOpen}
                  onOpenChange={(open: boolean) => {
                    setDrawerOpen(open)
                    if (open) {
                      setNameValue(user.name)
                    }
                  }}
                >
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Pen size={16} strokeWidth={1} />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="px-2.5">
                    <DrawerHeader className="px-0 text-left">
                      <DrawerTitle>Chỉnh sửa tên</DrawerTitle>
                      <DrawerDescription>
                        Cập nhật tên hiển thị cho tài khoản của bạn.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="pb-4">
                      <Input
                        value={name}
                        maxLength={32}
                        placeholder="Nhập tên mới"
                        onChange={(e) => setNameValue(e.target.value)}
                      />
                    </div>
                    <DrawerFooter className="px-0">
                      <Button
                        size={"lg"}
                        onClick={handleEditName}
                        disabled={!name.trim() || name.trim() === user.name}
                      >
                        Lưu thay đổi
                      </Button>
                      <DrawerClose asChild>
                        <Button size={"lg"} variant="outline">
                          Hủy
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-foreground/60">Thông tin đăng ký</p>
                  <p>{user.email}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/60">ID</p>
                  <div className="flex gap-1">
                    <p className="">{shortID}</p>
                    <button onClick={() => handleCopy()} className="">
                      <Copy size={16} strokeWidth={1} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <hr />
        <div>
          <CardSetting
            title="Xác minh"
            description="Chưa xác minh"
            icon={<User2 />}
          />
          <CardSetting
            onClick={() => route.push("/wellcome")}
            className="text-red-500"
            title="Đăng xuất"
            icon={<Download className="text-red-500" />}
          />
        </div>
      </div>
    </div>
  )
}
