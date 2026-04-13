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

import { ChevronDown } from "lucide-react"
import { useId, useMemo, useState } from "react"

type Props = {
  onSuccess?: () => void
}

export const FormBuySell: React.FC<Props> = ({ onSuccess }) => {
  const inputId = useId()
  const [isBuy, setIsBuy] = useState(true)
  const [currency, setCurrency] = useState(LIST_TOKEN[2]?.symbol)
  const [amount, setAmount] = useState<number | null>(null)
  const [isTokenPickerOpen, setIsTokenPickerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const selectedToken = useMemo(
    () => LIST_TOKEN.find((token) => token.symbol === currency),
    [currency]
  )

  const result = useMemo(() => {
    if (!selectedToken || !amount || amount <= 0) {
      return 0
    }
    return isBuy ? amount / selectedToken.usdt : amount * selectedToken.usdt
  }, [amount, isBuy, selectedToken])

  const handleConfirm = async () => {
    try {
      if (!selectedToken) {
        toast.error("Vui lòng chọn token")
        return
      }

      if (!amount || Number(amount) <= 0 || amount > 9999999) {
        const inputElement = document.getElementById(
          inputId
        ) as HTMLInputElement | null
        inputElement?.focus()
        toast.error("Vui lòng nhập số lượng hợp lệ")
        return
      }

      setIsLoading(true)

      await new Promise((resolve) => setTimeout(resolve, 1200))

      if (isBuy) {
        toast.success(
          `Đã mua ${result.toFixed(6)} ${selectedToken.symbol} với ${amount.toFixed(2)} USDT`
        )
      } else {
        toast.success(
          `Đã bán ${amount.toFixed(6)} ${selectedToken.symbol} và nhận ${result.toFixed(2)} USDT`
        )
      }

      setAmount(null)
      if (onSuccess) onSuccess()
    } catch {
      toast.error("Có lỗi xảy ra khi xử lý giao dịch")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-center">
        <div className="flex w-fit rounded-full bg-accent p-1">
          <button
            onClick={() => setIsBuy(true)}
            className={cn(
              "rounded-full px-6 py-2 font-semibold text-foreground/60 transition-colors",
              isBuy &&
                "border-t border-t-primary/10 bg-primary/20 text-primary shadow-sm shadow-primary/50"
            )}
            type="button"
          >
            Mua
          </button>
          <button
            onClick={() => setIsBuy(false)}
            className={cn(
              "rounded-full px-6 py-2 font-semibold text-foreground/60 transition-colors",
              !isBuy &&
                "border-t border-t-primary/10 bg-primary/20 text-primary shadow-sm shadow-primary/50"
            )}
            type="button"
          >
            Bán
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-xs text-foreground/50">
          <span>{isBuy ? "Thanh toán" : "Số lượng bán"}</span>
          <span>
            {isBuy ? "Bằng USDT" : `Token ${selectedToken?.symbol ?? ""}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-2xl font-bold text-foreground/60">
            {isBuy ? "USDT" : selectedToken?.symbol}
          </label>
          <input
            id={inputId}
            type="number"
            value={amount?.toString() || ""}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full bg-transparent text-end text-xl font-bold [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="py-2 text-center text-sm text-foreground/60">
        {isBuy ? "Bạn nhận được" : "Bạn nhận về"}:
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            {result.toFixed(isBuy ? 6 : 2)}
          </span>
          {!isBuy ? (
            <span className="font-semibold text-foreground">USDT</span>
          ) : (
            <Drawer
              open={isTokenPickerOpen}
              onOpenChange={setIsTokenPickerOpen}
            >
              <DrawerTrigger asChild>
                <button type="button">
                  <Badge className="h-7 cursor-pointer px-3">
                    {currency} <ChevronDown className="ml-1 h-3 w-3" />
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
                  {LIST_TOKEN.map((token) => (
                    <CardToken1
                      key={token.symbol}
                      name={token.name}
                      image={token.logoURI}
                      symbol={token.symbol}
                      onClick={() => {
                        setCurrency(token.symbol)
                        setIsTokenPickerOpen(false)
                      }}
                      className={cn(token.symbol === currency && "bg-accent")}
                    />
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>

      <div className="min-h-[44px]">
        {selectedToken && (
          <div className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground/50">
            {isBuy ? (
              <p>
                1 {selectedToken.symbol} = {selectedToken.usdt.toFixed(2)} USDT
              </p>
            ) : (
              <p>
                1 {selectedToken.symbol} bán được{" "}
                {selectedToken.usdt.toFixed(2)} USDT
              </p>
            )}
          </div>
        )}
      </div>

      <Button
        size="lg"
        onClick={handleConfirm}
        disabled={isLoading}
        className="mt-2 w-full"
      >
        {isLoading
          ? "Đang xử lý..."
          : isBuy
            ? `Mua ${selectedToken?.symbol ?? "token"}`
            : `Bán ${selectedToken?.symbol ?? "token"}`}
      </Button>
    </div>
  )
}
