"use client"

import { type BackendWallet } from "@/lib/api/wallets"
import { shortenHex } from "@/lib/utils/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/index"
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Wallet2,
} from "lucide-react"
import { useState } from "react"

type Props = {
  data: BackendWallet
}

const toNumber = (value: number | string | null | undefined) => {
  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) ? parsedValue : 0
  }

  return 0
}

export const SectionMyWallet = ({ data }: Props) => {
  const availableBalance = toNumber(data.available_balance)
  const blockedBalance = toNumber(data.blocked_balance)
  const totalBalance = availableBalance + blockedBalance
  const assetName = data.asset?.name || "Chưa có tài sản"
  const assetSymbol = data.asset?.symbol || "--"
  const walletTitle = data.asset?.name ? `Ví ${data.asset.name}` : "Ví cá nhân"
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Đã sao chép mã ví")
  }
  const [isHide, setIsHide] = useState(false)
  const walletId = shortenHex(data.id)

  return (
    <div className="flex w-full flex-col gap-2.5 lg:flex-row">
      {/* Wallet  */}
      <div className="w-full lg:w-1/3">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <span className="flex items-center gap-2">
                <Wallet2 className="h-5 w-5 text-primary" />
                {walletTitle}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 rounded-xl border border-secondary bg-secondary/30 p-4">
              <p className="mb-1 text-sm text-muted-foreground">Tổng tài sản</p>
              <div className="flex items-end gap-2">
                <button onClick={() => setIsHide(!isHide)} className=" ">
                  <h2 className="text-3xl font-bold tracking-tight">
                    {isHide
                      ? "******"
                      : totalBalance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </h2>
                </button>
                <span className="mb-1 text-sm font-medium text-muted-foreground">
                  USDT
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Mã ví</p>
              <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
                <span className="mr-2 truncate font-mono text-sm text-muted-foreground">
                  {walletId}
                </span>
                <Button
                  onClick={() => copyToClipboard(data.id)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <Button className="flex-1 gap-2" variant="default">
                <ArrowDownLeft className="h-4 w-4" /> Nhận
              </Button>
              <Button className="flex-1 gap-2" variant="outline">
                <ArrowUpRight className="h-4 w-4" /> Gửi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token List  */}
      <div className="w-full lg:w-2/3">
        <Card className="h-full">
          <CardHeader className="mb-4 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5 text-primary" />
              Thông tin ví
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border border-transparent bg-secondary/20 p-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary/50 shadow-sm">
                    {data.asset?.logo_url ? (
                      // Using standard img tag if strict Next/Image domain is not configured yet
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.asset.logo_url}
                        alt={assetName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold">
                        {assetSymbol.substring(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{assetName}</span>
                    <span className="text-xs text-muted-foreground">
                      {assetSymbol}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    data.status
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {data.status ? "Đang hoạt động" : "Tạm khóa"}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border bg-secondary/20 p-4">
                  <p className="text-sm text-muted-foreground">Khả dụng</p>
                  <p className="mt-2 text-xl font-semibold">
                    {availableBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}{" "}
                    {assetSymbol}
                  </p>
                </div>
                <div className="rounded-lg border bg-secondary/20 p-4">
                  <p className="text-sm text-muted-foreground">Đang khóa</p>
                  <p className="mt-2 text-xl font-semibold">
                    {blockedBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}{" "}
                    {assetSymbol}
                  </p>
                </div>
                <div className="rounded-lg border bg-secondary/20 p-4">
                  <p className="text-sm text-muted-foreground">Tổng cộng</p>
                  <p className="mt-2 text-xl font-semibold">
                    {totalBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}{" "}
                    {assetSymbol}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
