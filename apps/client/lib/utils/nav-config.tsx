import { History, Home, Search } from "lucide-react"
import { TNavItem } from "shared/src/types"

export const NAVBAR_ITEMS: TNavItem[] = [
  { label: "Home", href: "/user/home", icon: <Home /> },
  { label: "Search", href: "/user/search", icon: <Search /> },
  { label: "History", href: "/user/history", icon: <History /> },
]
