"use client"

import { useRequestWithdraw, useWallets } from "@/hooks"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/index"
import { useState } from "react"

export const FormSend: React.FC = () => {
  const { data: wallets } = useWallets()
  const requestWithdrawMutation = useRequestWithdraw()
  const [walletId, setWalletId] = useState("")
  const [amount, setAmount] = useState("")
  const [network, setNetwork] = useState("")
  const [toAddress, setToAddress] = useState("")

  const handleSubmit = async () => {
    try {
      const amountValue = Number(amount)
      if (!walletId) {
        toast.error("Vui lòng chọn ví")
        return
      }
      if (!amountValue || amountValue <= 0) {
        toast.error("Vui lòng nhập số lượng hợp lệ")
        return
      }
      if (!network.trim()) {
        toast.error("Vui lòng nhập network")
        return
      }
      if (!toAddress.trim()) {
        toast.error("Vui lòng nhập địa chỉ nhận")
        return
      }

      await requestWithdrawMutation.mutateAsync({
        walletId,
        payload: {
          amount: amountValue,
          network: network.trim(),
          to_address: toAddress.trim(),
        },
      })

      toast.success("Đã tạo yêu cầu rút tiền")
      setAmount("")
      setNetwork("")
      setToAddress("")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tạo yêu cầu rút tiền"
      )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Select value={walletId} onValueChange={setWalletId}>
        <SelectTrigger className="h-12 rounded-xl border-border bg-background">
          <SelectValue placeholder="Chọn ví muốn rút" />
        </SelectTrigger>
        <SelectContent>
          {wallets?.map((wallet) => (
            <SelectItem key={wallet.id} value={wallet.id}>
              {wallet.asset?.symbol || wallet.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Số lượng rút"
        className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/50"
      />

      <input
        type="text"
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
        placeholder="Network (ERC20, BEP20...)"
        className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/50"
      />

      <input
        type="text"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        placeholder="Địa chỉ ví nhận"
        className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/50"
      />

      <Button
        onClick={handleSubmit}
        disabled={requestWithdrawMutation.isPending}
        className="w-full"
      >
        {requestWithdrawMutation.isPending
          ? "Đang xử lý..."
          : "Tạo yêu cầu rút"}
      </Button>
    </div>
  )
}
