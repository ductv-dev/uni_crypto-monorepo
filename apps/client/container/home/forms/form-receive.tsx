"use client"

import { shortenHex } from "@/lib/utils/utils"
import { useUser } from "@/store/user-store"
import { toast } from "@workspace/ui/index"
import { Coins, Copy } from "lucide-react"
import { TUser } from "@workspace/shared/types"

export const FormReceive: React.FC = () => {
  const user = useUser((state: { user: TUser }) => state.user)
  const id = shortenHex(user?.id ?? "")

  const copyToClipboard = () => {
    if (!user?.id) return
    navigator.clipboard
      .writeText(user.id)
      .then(() => {
        toast.success("Đã copy vào clipboard", {
          icon: <Copy className="text-green-700" size={14} />,
          style: { borderRadius: 100 },
        })
      })
      .catch(() => {
        toast.error("Có lỗi xảy ra khi copy vào clipboard")
      })
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="pb-2 text-center text-sm text-foreground/60">
        Nạp tiền vào ví bằng cách chuyển crypto từ ví hoặc tài khoản khác
      </p>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="whitespace-nowrapflex-1 overflow-hidden rounded-lg bg-accent/50 px-3 py-1.5 text-lg font-semibold tracking-wider text-ellipsis text-foreground/60">
            {id}
          </p>
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center rounded-lg bg-primary p-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="h-[1px] flex-1 bg-border"></div>
        <p className="text-xs font-semibold tracking-widest text-foreground/40 uppercase">
          Từ tài khoản khác
        </p>
        <div className="h-[1px] flex-1 bg-border"></div>
      </div>

      <a
        href="https://www.coinbase.com/fr-fr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3.5 rounded-xl border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0052FF] text-white shadow-sm">
          <Coins strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-foreground/80">Coinbase</p>
          <p className="text-xs text-foreground/50">Kết nối tài khoản</p>
        </div>
      </a>
    </div>
  )
}
