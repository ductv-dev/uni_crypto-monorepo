import { MOCK_PERSONAL } from "@/data/mock-data-admin"
import { TPersonnelResponse } from "@/types/personnel.type"
import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query"

export const PERSONNEL_LIST_QUERY_KEY = "personnel-list"

const getPersonnel = async (
  limit: number,
  offset: number,
  search?: string,
  filter?: { status: string; role: string }
): Promise<TPersonnelResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  let filteredPersonnel = MOCK_PERSONAL

  if (search) {
    const normalizedSearch = search.trim().toLowerCase()

    filteredPersonnel = filteredPersonnel.filter((personnel) => {
      const searchFields = [
        personnel.id,
        personnel.fullName,
        personnel.email,
        personnel.role,
        personnel.status,
        personnel.lastActive,
        personnel.joinedDate,
      ]

      return searchFields.some((field) =>
        field.toLowerCase().includes(normalizedSearch)
      )
    })
  }

  if (filter?.status) {
    filteredPersonnel = filteredPersonnel.filter(
      (personnel) => personnel.status === filter.status
    )
  }

  if (filter?.role) {
    filteredPersonnel = filteredPersonnel.filter(
      (personnel) => personnel.role === filter.role
    )
  }

  const paginatedData = filteredPersonnel.slice(offset, offset + limit)
  const totalItems = filteredPersonnel.length
  const totalPages = Math.ceil(totalItems / limit)

  return {
    data: paginatedData,
    pagination: {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: totalItems,
      totalPages,
    },
  }
}

export const usePersonnel = (
  limit: number,
  offset: number,
  search: string,
  filter: { status: string; role: string }
): UseQueryResult<TPersonnelResponse, Error> => {
  return useQuery({
    queryKey: [PERSONNEL_LIST_QUERY_KEY, limit, offset, search, filter],
    queryFn: () => getPersonnel(limit, offset, search, filter),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}
