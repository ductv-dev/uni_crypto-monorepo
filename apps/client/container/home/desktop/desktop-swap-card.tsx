"use client"

import { CardToken1 } from "@/components/custom/cards/card-token-1"
import { LIST_TOKEN } from "@/data/mock-data-list-token"
import { cn } from "@/lib/utils/utils"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { toast } from "@workspace/ui/index"
import { ArrowDownUp } from "lucide-react"
import { useState } from "react"
import { TToken } from "shared/src/types"

export const DesktopSwapCard = () => {
  if (!LIST_TOKEN) return null

  const [tokenFrom, setTokenFrom] = useState<TToken["symbol"]>(
    LIST_TOKEN?.[0]?.symbol ?? ""
  )

  const [tokenTo, setTokenTo] = useState<TToken["symbol"]>(
    LIST_TOKEN?.[2]?.symbol ?? ""
  )
  const [isFromOpen, setIsFromOpen] = useState(false)
  const [isToOpen, setIsToOpen] = useState(false)

  // [FIX 2] Đổi state từ number sang string để xử lý được dấu thập phân (VD: 0.5)
  const [valueFrom, setValueFrom] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  let valueTo: number | null = 0
  let valueInUSDT = 0

  // [FIX 2] Parse ra số ở đây để tính toán
  const numericValueFrom = Number(valueFrom)

  if (tokenFrom && tokenTo && numericValueFrom > 0) {
    const fromData = LIST_TOKEN.find((t) => t.symbol === tokenFrom)
    const toData = LIST_TOKEN.find((t) => t.symbol === tokenTo)
    if (fromData && toData) {
      valueInUSDT = numericValueFrom * fromData.usdt
      valueTo = valueInUSDT / toData.usdt
    }
  }

  const handleSwap = async () => {
    if (!tokenFrom || !tokenTo) {
      toast.error("Vui lòng chọn cả hai token")
      return
    }
    if (tokenFrom === tokenTo) {
      toast.error("Token đi và token đến phải khác nhau")
      return
    }

    if (!valueFrom || numericValueFrom <= 0 || numericValueFrom > 9999999) {
      const el = document.getElementById(
        "desktop-valueFrom"
      ) as HTMLInputElement
      el?.focus()
      toast.error("Vui lòng nhập số lượng hợp lệ")
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success(
      `Đã đổi ${valueFrom} ${tokenFrom} (${valueInUSDT.toFixed(2)} USDT) sang ${valueTo?.toFixed(6)} ${tokenTo}`
    )

    // [FIX 3] Chỉ reset valueFrom thành rỗng, giữ nguyên tokenTo để user tiện swap tiếp
    setValueFrom("")
    setIsLoading(false)
  }

  const handleReverseTokens = () => {
    if (!tokenTo) {
      toast.error("Vui lòng chọn token đến trước")
      return
    }
    setTokenFrom(tokenTo)
    setTokenTo(tokenFrom)
    setValueFrom("")
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">Swap Token</h2>

      {/* From */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-xs text-foreground/50">
          <span>Từ</span>
          {tokenFrom && <span>Ví {tokenFrom}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Drawer open={isFromOpen} onOpenChange={setIsFromOpen}>
            <DrawerTrigger asChild>
              <button type="button">
                <Badge className="cursor-pointer">{tokenFrom}</Badge>
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[70%] max-h-full">
              <DrawerHeader>
                <DrawerTitle className="text-start text-lg font-medium">
                  Chọn token
                </DrawerTitle>
              </DrawerHeader>
              <div className="no-scrollbar w-full overflow-y-auto px-2.5">
                {LIST_TOKEN.map((token: TToken) => (
                  <CardToken1
                    key={token.symbol}
                    name={token.name}
                    image={token.logoURI}
                    symbol={token.symbol}
                    onClick={() => {
                      setTokenFrom(token.symbol)
                      setIsFromOpen(false)
                    }}
                    className={cn(token.symbol === tokenFrom && "bg-accent")}
                  />
                ))}
              </div>
            </DrawerContent>
          </Drawer>

          {/* [FIX 2] Xử lý regex ở input để người dùng gõ được số 0 và dấu chấm (VD: 0.05) */}
          <input
            id="desktop-valueFrom"
            type="text"
            inputMode="decimal"
            value={valueFrom}
            onChange={(e) => {
              const val = e.target.value
              // Regex: Chỉ cho phép rỗng hoặc chuỗi số có tối đa 1 dấu chấm thập phân
              if (val === "" || /^\d*\.?\d*$/.test(val)) {
                setValueFrom(val)
              }
            }}
            placeholder="0"
            className="w-full bg-transparent text-end text-xl font-bold [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Reverse */}
      <div className="flex justify-center">
        <button
          onClick={handleReverseTokens}
          className="rounded-full border border-border bg-background p-2 transition-colors hover:bg-accent"
          type="button"
        >
          <ArrowDownUp className="h-4 w-4" />
        </button>
      </div>

      {/* To */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-xs text-foreground/50">
          <span>Đến</span>
          {tokenTo && <span>Ví {tokenTo}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Drawer open={isToOpen} onOpenChange={setIsToOpen}>
            <DrawerTrigger asChild>
              <button type="button">
                <Badge className="cursor-pointer">
                  {tokenTo === "" ? "Chọn token" : tokenTo}
                </Badge>
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[70%] max-h-full">
              <DrawerHeader>
                <DrawerTitle className="text-start text-lg font-medium">
                  Chọn token
                </DrawerTitle>
              </DrawerHeader>
              <div className="no-scrollbar w-full overflow-y-auto px-2.5">
                {LIST_TOKEN.map(
                  (token: TToken) =>
                    token.symbol !== tokenFrom && (
                      <CardToken1
                        key={token.symbol}
                        name={token.name}
                        image={token.logoURI}
                        symbol={token.symbol}
                        onClick={() => {
                          setTokenTo(token.symbol)
                          setIsToOpen(false)
                        }}
                        className={cn(token.symbol === tokenTo && "bg-accent")}
                      />
                    )
                )}
              </div>
            </DrawerContent>
          </Drawer>
          <label className="text-end text-xl font-bold text-foreground/70">
            {valueTo ? valueTo.toFixed(6) : "0"}
          </label>
        </div>
      </div>

      {/* Rate hint */}
      {valueInUSDT > 0 && (
        <p className="text-center text-xs text-foreground/40">
          ≈ {valueInUSDT.toFixed(2)} USDT
        </p>
      )}

      <Button onClick={handleSwap} disabled={isLoading} className="w-full">
        {isLoading ? "Đang xử lý..." : "Hoán đổi ngay"}
      </Button>
    </div>
  )
}
