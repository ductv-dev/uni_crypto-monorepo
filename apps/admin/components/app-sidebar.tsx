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
  Download,
  FileSliders,
  FileText,
  LayoutDashboard,
  NotebookText,
  Send,
  Settings2,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"

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
  navGroups: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: "/dashboard",
          icon: <LayoutDashboard />,
        },
        {
          title: "Real-time Stats",
          url: "/dashboard/stats",
          icon: <LayoutDashboard />,
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          title: "All Users",
          url: "/users",
          icon: <Users />,
        },
      ],
    },
    {
      title: "Transactions",
      items: [
        {
          title: "Order Book",
          url: "/transactions/orderbook",
          icon: <NotebookText />,
        },
        {
          title: "Deposits",
          url: "/transactions/deposit",
          icon: <Send />,
        },
        {
          title: "Withdrawals",
          url: "/transactions/withdrawal",
          icon: <Download />,
        },
        {
          title: "Trade History",
          url: "/transactions/trade",
          icon: <ArrowLeftRight />,
        },
      ],
    },
    {
      title: "Assets & Markets",
      items: [
        {
          title: "Token Management",
          url: "/assets/tokens",
          icon: <Coins />,
        },
        {
          title: "Trading Pairs",
          url: "/assets/pairs",
          icon: <Coins />,
        },
      ],
    },
    {
      title: "Wallet & Treasury",
      items: [
        {
          title: "System Overview",
          url: "/wallet",
          icon: <FileSliders />,
        },
        {
          title: "Hot Wallets",
          url: "/wallet/hot-wallets",
          icon: <Wallet />,
        },
      ],
    },
    {
      title: "System Settings",
      items: [
        {
          title: "Fees & Commissions",
          url: "/settings/fees",
          icon: <Settings2 />,
        },
        {
          title: "Withdrawal Limits",
          url: "/settings/limits",
          icon: <Settings2 />,
        },
      ],
    },
    {
      title: "Content Management",
      items: [
        {
          title: "Banners",
          url: "/content/banners",
          icon: <FileText />,
        },
        {
          title: "Notifications",
          url: "/content/notifications",
          icon: <FileText />,
        },
        {
          title: "FAQs",
          url: "/content/faqs",
          icon: <FileText />,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Admin List",
          url: "/personnel",
          icon: <UserPlus />,
        },
        {
          title: "Roles & Permissions",
          url: "/personnel/roles",
          icon: <UserPlus />,
        },
        {
          title: "Audit Logs",
          url: "/audit-logs",
          icon: <ClipboardClock />,
        },
      ],
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
        <NavMain groups={data.navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
