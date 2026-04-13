"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { ScanQrCode, SearchIcon, UserSearch } from "lucide-react"
import { useState } from "react"

export const FormSend: React.FC = () => {
  const [query, setQuery] = useState("")

  return (
    <div className="flex flex-col gap-4">
      <InputGroup className="rounded-xl border-border bg-background">
        <InputGroupAddon>
          <SearchIcon className="text-foreground/40" size={18} />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Nhập địa chỉ hoặc tên người dùng..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 border-none bg-transparent px-2 text-base outline-none focus-visible:ring-0"
        />
        <InputGroupAddon align={"inline-end"}>
          <button className="p-1 text-foreground/40 transition-colors hover:text-foreground">
            <ScanQrCode size={20} />
          </button>
        </InputGroupAddon>
      </InputGroup>

      {!query && (
        <div className="flex w-full flex-col items-center justify-center gap-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-lg shadow-primary/10">
            <UserSearch strokeWidth={2.5} size={28} />
          </div>
          <p className="text-center text-sm text-foreground/50">
            Nhập địa chỉ, ENS hoặc tên người dùng
            <br />
            để bắt đầu gửi tài sản
          </p>
        </div>
      )}
    </div>
  )
}
