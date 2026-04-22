"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/layout/sidebar"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { LogoUniCrypto } from "@/components/team-switcher"
import {
  ArrowLeftRight,
  ClipboardClock,
  Coins,
  FileText,
  LayoutDashboard,
  Settings2,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"
import { NavSub } from "./nav-sub"

// This is the data for the sidebar.
const data = {
  user: {
    name: "Super Admin",
    email: "admin@unicrypto.com",
    avatar: "/avatars/admin.jpg",
  },
  logo: {
    name: "UniCrypto Admin",
    logo: "/icons/icon-192x192.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboard />,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Real-time Stats",
          url: "/dashboard/stats",
        },
      ],
    },
    {
      title: "User Management",
      url: "/users",
      icon: <Users />,
      items: [
        {
          title: "All Users",
          url: "/users",
        },
        {
          title: "Security & 2FA",
          url: "/users/security",
        },
      ],
    },

    {
      title: "Transactions",
      url: "/transactions",
      icon: <ArrowLeftRight />,
      items: [
        {
          title: "Deposits",
          url: "/transactions/deposit",
        },
        {
          title: "Withdrawals",
          url: "/transactions/withdrawal",
        },
        {
          title: "Trade History",
          url: "/transactions/trade",
        },
      ],
    },
    {
      title: "Assets & Markets",
      url: "/assets",
      icon: <Coins />,
      items: [
        {
          title: "Token Management",
          url: "/assets/tokens",
        },
        {
          title: "Trading Pairs",
          url: "/assets/pairs",
        },
      ],
    },
    {
      title: "Wallet & Treasury",
      url: "/wallet",
      icon: <Wallet />,
      items: [
        {
          title: "System Overview",
          url: "/wallet",
        },
        {
          title: "Hot Wallets",
          url: "/wallet/hot-wallets",
        },
      ],
    },
    {
      title: "System Settings",
      url: "/settings",
      icon: <Settings2 />,
      items: [
        {
          title: "Fees & Commissions",
          url: "/settings/fees",
        },
        {
          title: "Withdrawal Limits",
          url: "/settings/limits",
        },
      ],
    },
    {
      title: "Content Management",
      url: "/content",
      icon: <FileText />,
      items: [
        {
          title: "Banners",
          url: "/content/banners",
        },
        {
          title: "Notifications",
          url: "/content/notifications",
        },
        {
          title: "FAQs",
          url: "/content/faqs",
        },
      ],
    },
    {
      title: "Personnel",
      url: "/personnel",
      icon: <UserPlus />,
      items: [
        {
          title: "Admin List",
          url: "/personnel",
        },
        {
          title: "Roles & Permissions",
          url: "/personnel/roles",
        },
      ],
    },
  ],
  navSub: [
    {
      title: "Audit Logs",
      url: "/audit-logs",
      icon: <ClipboardClock />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoUniCrypto data={data.logo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSub items={data.navSub} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
