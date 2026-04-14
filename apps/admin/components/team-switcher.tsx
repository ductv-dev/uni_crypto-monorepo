"use client"

import Image from "next/image"
import * as React from "react"

import { SidebarMenuButton } from "@/components/layout/sidebar"
type LogoUniCryptoProps = {
  name: string
  logo: string
}
type Props = {
  data: LogoUniCryptoProps
}

export const LogoUniCrypto: React.FC<Props> = ({ data }) => {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Image src={data.logo} alt={data.name} width={24} height={24} />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{data.name}</span>
      </div>
    </SidebarMenuButton>
  )
}
