import { LIST_USER } from "@/data/mock-data-user"
import { TUserResponse } from "@/types/user.type"
import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query"

const USER_LIST_QUERY_KEY = "user-list"

const getUsers = async (
  limit: number,
  offset: number,
  search?: string,
  filter?: { status: string; country: string }
): Promise<TUserResponse> => {
  let filteredUsers = LIST_USER

  if (search) {
    const lowerSearch = search.toLowerCase()

    filteredUsers = LIST_USER.filter((user) => {
      const matchEmail = user.email?.toLowerCase().includes(lowerSearch)
      const matchName = user.username?.toLowerCase().includes(lowerSearch)
      const matchId = String(user.id_number).toLowerCase().includes(lowerSearch)
      const matchPhone = user.phone?.toLowerCase().includes(lowerSearch)
      const maychCountry = user.country?.toLowerCase().includes(lowerSearch)
      return matchEmail || matchName || matchId || matchPhone || maychCountry
    })
  }

  if (filter?.status) {
    filteredUsers = filteredUsers.filter(
      (user) => user.status === filter.status
    )
  }

  if (filter?.country) {
    filteredUsers = filteredUsers.filter(
      (user) => user.country === filter.country
    )
  }

  const paginatedData = filteredUsers.slice(offset, offset + limit)

  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / limit)

  return Promise.resolve({
    data: paginatedData,
    pagination: {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: totalItems,
      totalPages: totalPages,
    },
  })
}

export const useUser = (
  limit: number,
  offset: number,
  search: string,
  filter: { status: string; country: string }
): UseQueryResult<TUserResponse, Error> => {
  return useQuery({
    queryKey: [USER_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: () => getUsers(limit, offset, search, filter),
    staleTime: 1000 * 60 * 5, // 5 phút
    placeholderData: keepPreviousData,
  })
}
