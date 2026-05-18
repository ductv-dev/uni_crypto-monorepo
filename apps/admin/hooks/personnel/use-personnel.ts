import {
  buildDisplayName,
  derivePersonnelStatus,
  getAdminAccounts,
} from "@/lib/api/access-control"
import { TPersonnelResponse } from "@/types/personnel.type"
import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query"

export const PERSONNEL_LIST_QUERY_KEY = "personnel-list"

export const usePersonnel = (
  limit: number,
  offset: number,
  search: string,
  filter: { status: string; role: string }
): UseQueryResult<TPersonnelResponse, Error> => {
  return useQuery({
    queryKey: [PERSONNEL_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: async () => {
      const response = await getAdminAccounts({
        limit,
        offset,
        search,
        roleId: filter.role || undefined,
        status:
          filter.status === "active" ||
          filter.status === "inactive" ||
          filter.status === "blocked"
            ? filter.status
            : undefined,
      })

      return {
        data: response.data.map((account) => ({
          id: account.id,
          fullName: buildDisplayName(
            account.first_name,
            account.last_name,
            account.email
          ),
          email: account.email,
          roleId: account.role_id ?? "",
          role: account.role_name ?? "Chưa gán vai trò",
          status: derivePersonnelStatus(account.is_active, account.is_blocked),
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
          phoneNumber: account.phone_number,
        })),
        pagination: {
          page: Math.floor(response.meta.offset / response.meta.limit) + 1,
          limit: response.meta.limit,
          total: response.meta.total,
          totalPages:
            response.meta.totalPages ??
            Math.ceil(response.meta.total / response.meta.limit),
        },
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}
