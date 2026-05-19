import { Bell, History, Home, Search } from "lucide-react"
import { TNavItem } from "@workspace/shared/types"

export const NAVBAR_ITEMS: TNavItem[] = [
  { label: "Home", href: "/user/home", icon: <Home /> },
  { label: "Search", href: "/user/search", icon: <Search /> },
  { label: "Notifications", href: "/user/notifications", icon: <Bell /> },
  { label: "History", href: "/user/history", icon: <History /> },
]
