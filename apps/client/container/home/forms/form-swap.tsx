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
import { useId, useState } from "react"

import { TToken } from "@workspace/shared/types"

type Props = {
  onSuccess?: () => void
}

export const FormSwap: React.FC<Props> = ({ onSuccess }) => {
  const inputId = useId()
  const [tokenFrom, setTokenFrom] = useState<TToken["symbol"]>(
    LIST_TOKEN?.[0]?.symbol ?? ""
  )

  const [tokenTo, setTokenTo] = useState<TToken["symbol"]>(
    LIST_TOKEN?.[2]?.symbol ?? ""
  )
  const [isFromOpen, setIsFromOpen] = useState(false)
  const [isToOpen, setIsToOpen] = useState(false)
  const [valueFrom, setValueFrom] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  let valueTo: number | null = 0
  let valueInUSDT = 0

  if (tokenFrom && tokenTo && valueFrom) {
    const tokenFromData = LIST_TOKEN.find((t) => t.symbol === tokenFrom)
    const tokenToData = LIST_TOKEN.find((t) => t.symbol === tokenTo)
    if (tokenFromData && tokenToData) {
      const valueFromNum = Number(valueFrom)
      if (valueFromNum > 0) {
        valueInUSDT = valueFromNum * tokenFromData.usdt
        valueTo = valueInUSDT / tokenToData.usdt
      }
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
    if (
      !valueFrom ||
      valueFrom <= 0 ||
      valueFrom > 9999999 ||
      valueFrom === null
    ) {
      const el = document.getElementById(inputId) as HTMLInputElement
      el?.focus()
      toast.error("Vui lòng nhập số lượng hợp lệ")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(
      `Đã đổi ${valueFrom} ${tokenFrom} (${valueInUSDT.toFixed(2)} USDT) sang ${valueTo?.toFixed(6)} ${tokenTo}`
    )

    setValueFrom(null)
    setTokenTo("")
    setIsLoading(false)

    if (onSuccess) {
      onSuccess()
    }
  }

  const handleReverseTokens = () => {
    if (!tokenTo) {
      toast.error("Vui lòng chọn token đến trước")
      return
    }
    setTokenFrom(tokenTo)
    setTokenTo(tokenFrom)
    setValueFrom(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-xs text-foreground/50">
          <span>Từ</span>
          {tokenFrom && <span>Ví {tokenFrom}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Drawer open={isFromOpen} onOpenChange={setIsFromOpen}>
            <DrawerTrigger asChild>
              <button type="button">
                <Badge className="cursor-pointer font-semibold">
                  {tokenFrom}
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
                {LIST_TOKEN.map((t) => (
                  <CardToken1
                    key={t.symbol}
                    name={t.name}
                    image={t.logoURI}
                    symbol={t.symbol}
                    onClick={() => {
                      setTokenFrom(t.symbol)
                      setIsFromOpen(false)
                    }}
                    className={cn(t.symbol === tokenFrom && "bg-accent")}
                  />
                ))}
              </div>
            </DrawerContent>
          </Drawer>
          <input
            id={inputId}
            type="number"
            value={valueFrom?.toString() || ""}
            onChange={(e) => setValueFrom(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full bg-transparent text-end text-xl font-bold [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="relative z-10 -my-3 flex justify-center">
        <button
          onClick={handleReverseTokens}
          className="rounded-full border border-border bg-background p-2 shadow-sm transition-colors hover:bg-accent"
          type="button"
        >
          <ArrowDownUp className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-xs text-foreground/50">
          <span>Đến</span>
          {tokenTo && <span>Ví {tokenTo}</span>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Drawer open={isToOpen} onOpenChange={setIsToOpen}>
            <DrawerTrigger asChild>
              <button type="button">
                <Badge className="cursor-pointer font-semibold">
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
                {LIST_TOKEN.filter((t) => t.symbol !== tokenFrom).map((t) => (
                  <CardToken1
                    key={t.symbol}
                    name={t.name}
                    image={t.logoURI}
                    symbol={t.symbol}
                    onClick={() => {
                      setTokenTo(t.symbol)
                      setIsToOpen(false)
                    }}
                    className={cn(t.symbol === tokenTo && "bg-accent")}
                  />
                ))}
              </div>
            </DrawerContent>
          </Drawer>
          <label className="text-end text-xl font-bold text-foreground/70">
            {valueTo ? valueTo.toFixed(6) : "0"}
          </label>
        </div>
      </div>

      <div className="min-h-[20px]">
        {valueInUSDT > 0 && (
          <p className="text-center text-xs text-foreground/40">
            ≈ {valueInUSDT.toFixed(2)} USDT
          </p>
        )}
      </div>

      <Button
        onClick={handleSwap}
        disabled={isLoading}
        size="lg"
        className="mt-2 w-full"
      >
        {isLoading ? "Đang xử lý..." : "Hoán đổi ngay"}
      </Button>
    </div>
  )
}
