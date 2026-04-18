"use client"

import { useUser } from "@/store/user-store"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useState } from "react"
import { TUser } from "@workspace/shared/types"
import { AddNewWallet } from "./sections/add-new-wallet"
import { HeaderMyWallet } from "./sections/header-my-wallet"
import { SectionMyWallet } from "./sections/section-my-wallet"

export const MyWallet = () => {
  const user = useUser((state: { user: TUser }) => state.user)
  const wallet = user?.wallet
  const [selectedWalletAddress, setSelectedWalletAddress] = useState<
    string | undefined
  >()

  const activeWallet = selectedWalletAddress
    ? wallet?.find((w) => w.address === selectedWalletAddress) || wallet?.[0]
    : wallet?.[0]

  return (
    <div className="min-h-screen">
      <HeaderMyWallet />
      {wallet && wallet.length > 0 ? (
        <div className="">
          <Select
            value={activeWallet?.address}
            onValueChange={(val) => setSelectedWalletAddress(val)}
          >
            <SelectTrigger className="w-[200px] bg-primary px-4 py-2 font-semibold text-primary-foreground">
              <SelectValue placeholder="Select a wallet" />
            </SelectTrigger>
            <SelectGroup>
              <SelectContent>
                <div className="flex flex-col gap-2">
                  {wallet.map((item) => (
                    <SelectItem key={item.address} value={item.address}>
                      {item.name}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </SelectGroup>
          </Select>

          <SectionMyWallet data={activeWallet!} />
        </div>
      ) : (
        <div className="mt-20">
          <AddNewWallet />
        </div>
      )}
    </div>
  )
}
