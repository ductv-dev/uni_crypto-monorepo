import { TPersonnel } from "@/types/personnel.type"

export const MOCK_PERSONAL: TPersonnel[] = [
  {
    id: "USR-001",
    fullName: "Alice Wonderland",
    email: "alice@example.com",
    role: "Super Admin",
    status: "active",
    lastActive: "2 mins ago",
    joinedDate: "2023-01-15",
  },
  {
    id: "USR-002",
    fullName: "Bob Builder",
    email: "bob@example.com",
    role: "Manager",
    status: "active",
    lastActive: "1 hour ago",
    joinedDate: "2023-03-22",
  },
  {
    id: "USR-003",
    fullName: "Charlie Chaplin",
    email: "charlie@example.com",
    role: "Support",
    status: "inactive",
    lastActive: "5 days ago",
    joinedDate: "2023-06-10",
  },
  {
    id: "USR-004",
    fullName: "Diana Prince",
    email: "diana@example.com",
    role: "Compliance",
    status: "pending",
    lastActive: "Never",
    joinedDate: "2023-10-05",
  },
  {
    id: "USR-005",
    fullName: "Evan Hansen",
    email: "evan@example.com",
    role: "Support",
    status: "active",
    lastActive: "10 mins ago",
    joinedDate: "2023-11-20",
  },
]
