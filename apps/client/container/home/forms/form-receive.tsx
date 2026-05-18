"use client"

import { useRequestDeposit, useWallets } from "@/hooks"
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

export const FormReceive: React.FC = () => {
  const { data: wallets } = useWallets()
  const requestDepositMutation = useRequestDeposit()
  const [walletId, setWalletId] = useState("")
  const [amount, setAmount] = useState("")
  const [network, setNetwork] = useState("")
  const [txHash, setTxHash] = useState("")
  const [fromAddress, setFromAddress] = useState("")

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
      if (!txHash.trim()) {
        toast.error("Vui lòng nhập tx hash")
        return
      }
      if (!fromAddress.trim()) {
        toast.error("Vui lòng nhập địa chỉ gửi")
        return
      }

      await requestDepositMutation.mutateAsync({
        walletId,
        payload: {
          amount: amountValue,
          network: network.trim(),
          tx_hash: txHash.trim(),
          from_address: fromAddress.trim(),
        },
      })

      toast.success("Đã tạo yêu cầu nạp tiền")
      setAmount("")
      setNetwork("")
      setTxHash("")
      setFromAddress("")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tạo yêu cầu nạp tiền"
      )
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="pb-2 text-center text-sm text-foreground/60">
        Tạo yêu cầu nạp tiền sau khi bạn đã chuyển coin on-chain.
      </p>

      <Select value={walletId} onValueChange={setWalletId}>
        <SelectTrigger className="h-12 rounded-xl border-border bg-background">
          <SelectValue placeholder="Chọn ví muốn nạp" />
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
        placeholder="Số lượng nạp"
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
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        placeholder="Tx hash"
        className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/50"
      />

      <input
        type="text"
        value={fromAddress}
        onChange={(e) => setFromAddress(e.target.value)}
        placeholder="Địa chỉ gửi"
        className="h-12 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/50"
      />

      <Button
        onClick={handleSubmit}
        disabled={requestDepositMutation.isPending}
        className="w-full"
      >
        {requestDepositMutation.isPending ? "Đang xử lý..." : "Tạo yêu cầu nạp"}
      </Button>
    </div>
  )
}
