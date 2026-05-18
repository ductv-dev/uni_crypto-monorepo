"use client"

import { CardToken1 } from "@/components/custom/cards/card-token-1"
import { useCreateOrder, useTradeMarkets } from "@/hooks"
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
import { useEffect, useId, useMemo, useState } from "react"

type Props = {
  onSuccess?: () => void
}

export const FormBuySell: React.FC<Props> = ({ onSuccess }) => {
  const inputId = useId()
  const priceInputId = useId()
  const [isBuy, setIsBuy] = useState(true)
  const [selectedMarketId, setSelectedMarketId] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [priceInput, setPriceInput] = useState("")
  const [isTokenPickerOpen, setIsTokenPickerOpen] = useState(false)
  const { data: markets, isLoading: isMarketsLoading } = useTradeMarkets()
  const createOrderMutation = useCreateOrder()

  useEffect(() => {
    if (!selectedMarketId && markets?.length) {
      const firstMarket = markets[0]
      if (firstMarket) {
        setSelectedMarketId(firstMarket.id)
      }
    }
  }, [markets, selectedMarketId])

  const selectedMarket = useMemo(
    () => markets?.find((market) => market.id === selectedMarketId),
    [markets, selectedMarketId]
  )

  const amountNumber = useMemo(() => Number(amount) || 0, [amount])
  const priceNumber = useMemo(() => Number(priceInput) || 0, [priceInput])

  useEffect(() => {
    if (!selectedMarket) {
      return
    }

    if (!priceInput) {
      setPriceInput(String(Number(selectedMarket.last_price) || ""))
    }
  }, [selectedMarket, priceInput])

  const quantity = useMemo(() => {
    if (amountNumber <= 0 || priceNumber <= 0) {
      return 0
    }

    return isBuy ? amountNumber / priceNumber : amountNumber
  }, [amountNumber, isBuy, priceNumber])

  const result = useMemo(() => {
    if (amountNumber <= 0 || priceNumber <= 0) {
      return 0
    }

    return isBuy ? quantity : amountNumber * priceNumber
  }, [amountNumber, isBuy, priceNumber, quantity])

  const handleConfirm = async () => {
    try {
      if (!selectedMarket) {
        toast.error("Vui lòng chọn market")
        return
      }

      if (!amountNumber || amountNumber <= 0 || amountNumber > 9999999) {
        const inputElement = document.getElementById(
          inputId
        ) as HTMLInputElement | null
        inputElement?.focus()
        toast.error("Vui lòng nhập số lượng hợp lệ")
        return
      }

      if (!priceNumber || priceNumber <= 0) {
        const inputElement = document.getElementById(
          priceInputId
        ) as HTMLInputElement | null
        inputElement?.focus()
        toast.error("Vui lòng nhập giá hợp lệ")
        return
      }

      if (!quantity || quantity <= 0) {
        toast.error("Số lượng lệnh không hợp lệ")
        return
      }

      await createOrderMutation.mutateAsync({
        market_id: selectedMarket.id,
        type: "limit",
        side: isBuy ? "buy" : "sell",
        price: priceNumber,
        quantity,
      })

      if (isBuy) {
        toast.success(
          `Đã đặt lệnh mua ${quantity.toFixed(6)} ${selectedMarket.baseAsset.symbol}`
        )
      } else {
        toast.success(
          `Đã đặt lệnh bán ${quantity.toFixed(6)} ${selectedMarket.baseAsset.symbol}`
        )
      }

      setAmount("")
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xử lý giao dịch"
      )
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
            {isBuy
              ? `Bằng ${selectedMarket?.quoteAsset.symbol ?? "QUOTE"}`
              : `Token ${selectedMarket?.baseAsset.symbol ?? ""}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-2xl font-bold text-foreground/60">
            {isBuy
              ? selectedMarket?.quoteAsset.symbol || "QUOTE"
              : selectedMarket?.baseAsset.symbol}
          </label>
          <input
            id={inputId}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-end text-xl font-bold [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-xs text-foreground/50">
          <span>Giá đặt lệnh</span>
          <span>
            {selectedMarket?.quoteAsset.symbol ?? "QUOTE"} /{" "}
            {selectedMarket?.baseAsset.symbol ?? "BASE"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-2xl font-bold text-foreground/60">
            {selectedMarket?.quoteAsset.symbol || "QUOTE"}
          </label>
          <input
            id={priceInputId}
            type="number"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
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
          {isBuy ? (
            <span className="font-semibold text-foreground">
              {selectedMarket?.baseAsset.symbol ?? "BASE"}
            </span>
          ) : (
            <span className="font-semibold text-foreground">
              {selectedMarket?.quoteAsset.symbol ?? "QUOTE"}
            </span>
          )}
          <Drawer open={isTokenPickerOpen} onOpenChange={setIsTokenPickerOpen}>
            <DrawerTrigger asChild>
              <button type="button">
                <Badge className="h-7 cursor-pointer px-3">
                  {selectedMarket?.symbol ?? "Chọn market"}{" "}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Badge>
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[70%] max-h-full">
              <DrawerHeader>
                <DrawerTitle className="text-start text-lg font-medium">
                  Chọn market
                </DrawerTitle>
              </DrawerHeader>
              <div className="no-scrollbar w-full overflow-y-auto px-2.5">
                {markets?.map((market) => (
                  <CardToken1
                    key={market.id}
                    name={market.baseAsset.name}
                    image={market.baseAsset.logo_url || ""}
                    symbol={market.symbol}
                    onClick={() => {
                      setSelectedMarketId(market.id)
                      setPriceInput(String(Number(market.last_price) || ""))
                      setIsTokenPickerOpen(false)
                    }}
                    className={cn(
                      market.id === selectedMarketId && "bg-accent"
                    )}
                  />
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div className="min-h-[44px]">
        {selectedMarket && (
          <div className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground/50">
            {isBuy ? (
              <p>
                1 {selectedMarket.baseAsset.symbol} = {priceNumber.toFixed(2)}{" "}
                {selectedMarket.quoteAsset.symbol}
              </p>
            ) : (
              <p>
                1 {selectedMarket.baseAsset.symbol} bán được{" "}
                {priceNumber.toFixed(2)} {selectedMarket.quoteAsset.symbol}
              </p>
            )}
          </div>
        )}
      </div>

      <Button
        size="lg"
        onClick={handleConfirm}
        disabled={
          createOrderMutation.isPending || isMarketsLoading || !selectedMarket
        }
        className="mt-2 w-full"
      >
        {createOrderMutation.isPending
          ? "Đang xử lý..."
          : isMarketsLoading
            ? "Đang tải market..."
            : isBuy
              ? `Mua ${selectedMarket?.baseAsset.symbol ?? "token"}`
              : `Bán ${selectedMarket?.baseAsset.symbol ?? "token"}`}
      </Button>
    </div>
  )
}
