"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/layout/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  groups,
}: {
  groups: {
    title?: string
    items: {
      title: string
      url: string
      icon?: React.ReactNode
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title || "main"}>
          {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
