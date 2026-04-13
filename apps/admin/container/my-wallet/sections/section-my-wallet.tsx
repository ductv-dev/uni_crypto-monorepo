"use client"

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
import { TWallet } from "shared/src/types"

type Props = {
  data: TWallet
}

export const SectionMyWallet = ({ data }: Props) => {
  const totalBalance =
    data?.tokens?.reduce((acc, item) => acc + item.amount * item.usdValue, 0) ||
    0
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Đã sao chép địa chỉ ví")
  }
  const [isHide, setIsHide] = useState(false)
  const walletAddress = shortenHex(data.address)
  return (
    <div className="flex w-full flex-col gap-2.5 p-2.5 lg:flex-row">
      {/* Wallet  */}
      <div className="w-full lg:w-1/3">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <span className="flex items-center gap-2">
                <Wallet2 className="h-5 w-5 text-primary" />
                {data.name}
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
              <p className="text-sm font-medium">Địa chỉ ví</p>
              <div className="flex items-center justify-between rounded-lg border bg-secondary/20 p-3">
                <span className="mr-2 truncate font-mono text-sm text-muted-foreground">
                  {walletAddress}
                </span>
                <Button
                  onClick={() => copyToClipboard(data.address)}
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
              Tài sản ({data.tokens?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.tokens && data.tokens.length > 0 ? (
              <div className="flex flex-col gap-2">
                {data.tokens.map((item) => {
                  const itemTotal = item.amount * item.usdValue
                  return (
                    <div
                      key={item.symbol}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-secondary hover:bg-secondary/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-secondary/50 shadow-sm">
                          {item.logoURI ? (
                            // Using standard img tag if strict Next/Image domain is not configured yet
                            <img
                              src={item.logoURI}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold">
                              {item.symbol.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.symbol}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">
                          $
                          {itemTotal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.amount.toLocaleString(undefined, {
                            maximumFractionDigits: 4,
                          })}{" "}
                          {item.symbol}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Activity className="mb-3 h-10 w-10 opacity-20" />
                <p className="text-sm">Chưa có tài sản nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
