"use client"

import { useWallets } from "@/hooks"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useState } from "react"
import { CircleAlert, LoaderCircle } from "lucide-react"
import { AddNewWallet } from "./sections/add-new-wallet"
import { HeaderMyWallet } from "./sections/header-my-wallet"
import { SectionMyWallet } from "./sections/section-my-wallet"

export const MyWallet = () => {
  const { data: wallets, isLoading, isError, error, refetch } = useWallets()
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>()

  const activeWallet = selectedWalletId
    ? wallets?.find((wallet) => wallet.id === selectedWalletId) || wallets?.[0]
    : wallets?.[0]

  return (
    <div className="min-h-screen">
      <HeaderMyWallet />

      {isLoading ? (
        <div className="px-4">
          <Card>
            <CardContent className="flex min-h-60 flex-col items-center justify-center gap-3">
              <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Đang tải danh sách ví...
              </p>
            </CardContent>
          </Card>
        </div>
      ) : isError ? (
        <div className="px-4">
          <Card>
            <CardContent className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
              <CircleAlert className="h-6 w-6 text-destructive" />
              <p className="text-sm font-medium">Không thể tải danh sách ví</p>
              <p className="text-sm text-muted-foreground">
                {error?.message || "Đã có lỗi xảy ra khi tải dữ liệu ví."}
              </p>
              <Button onClick={() => void refetch()}>Thử lại</Button>
            </CardContent>
          </Card>
        </div>
      ) : wallets && wallets.length > 0 ? (
        <div className="px-4">
          <Select
            value={activeWallet?.id}
            onValueChange={(value) => setSelectedWalletId(value)}
          >
            <SelectTrigger className="w-[200px] bg-primary px-4 py-2 font-semibold text-primary-foreground">
              <SelectValue placeholder="Chọn ví" />
            </SelectTrigger>
            <SelectGroup>
              <SelectContent>
                <div className="flex flex-col gap-2">
                  {wallets.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.asset?.symbol || item.asset?.name || item.id}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </SelectGroup>
          </Select>

          <SectionMyWallet data={activeWallet!} />
        </div>
      ) : (
        <div className="mt-20">
          <AddNewWallet />
        </div>
      )}
    </div>
  )
}
