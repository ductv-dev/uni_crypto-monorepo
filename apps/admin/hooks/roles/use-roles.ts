import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { TRole } from "@/types/role.type"

export const ROLE_LIST_QUERY_KEY = "roles-list"

const mockRoles: TRole[] = [
  {
    id: "ROL-001",
    name: "Super Admin",
    description: "Full access to all system features and settings.",
    usersCount: 2,
    status: "active",
  },
  {
    id: "ROL-002",
    name: "Manager",
    description:
      "Can manage users, view reports, and configure basic settings.",
    usersCount: 5,
    status: "active",
  },
  {
    id: "ROL-003",
    name: "Support",
    description: "Can view user details and handle support tickets.",
    usersCount: 12,
    status: "active",
  },
  {
    id: "ROL-004",
    name: "Compliance",
    description: "Can review KYC documents and monitor transactions.",
    usersCount: 3,
    status: "active",
  },
  {
    id: "ROL-005",
    name: "Guest",
    description: "Read-only access to selected areas.",
    usersCount: 0,
    status: "inactive",
  },
]

const getRoles = async (): Promise<TRole[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockRoles
}

export const useGetRoles = (): UseQueryResult<TRole[], Error> => {
  return useQuery({
    queryKey: [ROLE_LIST_QUERY_KEY],
    queryFn: getRoles,
  })
}
