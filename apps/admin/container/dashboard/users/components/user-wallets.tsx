"use client"

import { useState } from "react"

import { ArrowDownLeft, ArrowUpRight, Copy, Lock, Wallet } from "lucide-react"

import { useUserWallets } from "@/hooks/users/use-user-wallet"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "@workspace/ui/index"

type TUserDetailViewProps = {
  id: string
}

export const UserWalletsView: React.FC<TUserDetailViewProps> = ({ id }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: wallets, isLoading } = useUserWallets(id)

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success("Đã sao chép địa chỉ ví")
  }

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => setIsDialogOpen(true)}
          className="flex cursor-pointer items-center gap-2 text-sm"
        >
          <Wallet className="h-4 w-4" />
          Danh sách ví
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] bg-slate-50/50 backdrop-blur-xl sm:max-w-5xl dark:bg-slate-950/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Wallet className="h-6 w-6 text-primary" />
            Danh sách ví người dùng
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : wallets?.data && wallets.data.length > 0 ? (
            <div className="grid max-h-[500px] grid-cols-1 gap-6 overflow-y-auto md:grid-cols-2">
              {wallets.data.map((wallet) => (
                <Card
                  key={wallet.id}
                  className="group overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <CardHeader className="relative pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary ring-1 ring-primary/20">
                          <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">
                            {wallet.asset}
                          </CardTitle>
                          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            {wallet.network}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={getStatusVariant(wallet.status)}
                        className="px-3 py-1 capitalize"
                      >
                        {wallet.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-4">
                    <div className="grid grid-cols-3 gap-2 py-4">
                      <div className="space-y-1">
                        <p className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
                          <ArrowDownLeft className="h-3 w-3 text-green-500" />{" "}
                          Khả dụng
                        </p>
                        <p className="text-sm font-bold tracking-tight">
                          {wallet.availableBalance}
                        </p>
                      </div>
                      <div className="space-y-1 border-x border-slate-200 px-3 dark:border-slate-800">
                        <p className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
                          <Lock className="h-3 w-3 text-amber-500" /> Đóng băng
                        </p>
                        <p className="text-sm font-bold tracking-tight">
                          {wallet.lockedBalance}
                        </p>
                      </div>
                      <div className="space-y-1 pl-1">
                        <p className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase">
                          <ArrowUpRight className="h-3 w-3 text-primary" /> Tổng
                          số
                        </p>
                        <p className="text-sm font-bold tracking-tight text-primary">
                          {wallet.totalBalance}
                        </p>
                      </div>
                    </div>

                    <div className="group/address flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-900">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[10px] font-bold text-muted-foreground uppercase">
                          Địa chỉ ví
                        </p>
                        <p className="truncate font-mono text-xs text-slate-600 dark:text-slate-400">
                          {wallet.walletAddress}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 cursor-pointer hover:bg-white dark:hover:bg-slate-800"
                        onClick={() => handleCopy(wallet.walletAddress)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white py-12 text-muted-foreground dark:bg-slate-900">
              <Wallet className="mb-4 h-12 w-12 opacity-20" />
              <p className="text-lg font-medium">Người dùng chưa có ví nào</p>
              <p className="text-sm">
                Hệ thống chưa ghi nhận dữ liệu ví cho tài khoản này.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
