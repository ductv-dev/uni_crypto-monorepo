"use client"
import { LIST_TOKEN } from "@/data/mock-data-list-token"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { TToken } from "@workspace/shared/types"

// Tạo độ trễ giả lập API
const fakeApiDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Hàm tìm kiếm token
export const searchToken = async (query: string): Promise<TToken[]> => {
  await fakeApiDelay(500)
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return LIST_TOKEN

  return LIST_TOKEN.filter((token) => {
    const name = token.name.toLowerCase()
    const symbol = token.symbol.toLowerCase()
    const address = token.address.toLowerCase()

    return (
      name.includes(normalizedQuery) ||
      symbol.includes(normalizedQuery) ||
      address.includes(normalizedQuery)
    )
  })
}

// Không thể wrap hook bằng debounce() vì vi phạm Rules of Hooks.
// Debounce được thực hiện bên trong hook bằng useState + useEffect.
export const useSearchTokens = (query: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const normalizedQuery = debouncedQuery.trim()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  return useQuery<TToken[]>({
    queryKey: ["search-token", debouncedQuery],
    queryFn: () => searchToken(debouncedQuery),
    enabled: Boolean(normalizedQuery),
    staleTime: 1000 * 60 * 5,
  })
}
