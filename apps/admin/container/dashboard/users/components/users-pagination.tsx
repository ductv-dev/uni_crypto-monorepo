"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { TUserPagination } from "../types"

type TUsersPaginationProps = {
  pagination: TUserPagination
  totalPages: number
  onChange: React.Dispatch<React.SetStateAction<TUserPagination>>
}

export const UsersPagination: React.FC<TUsersPaginationProps> = ({
  pagination,
  totalPages,
  onChange,
}) => {
  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(event) => {
              event.preventDefault()
              onChange((prev) => ({
                ...prev,
                offset: Math.max(0, prev.offset - prev.limit),
              }))
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => {
          const isActive = pagination.offset / pagination.limit === index

          return (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={isActive}
                onClick={(event) => {
                  event.preventDefault()
                  onChange((prev) => ({
                    ...prev,
                    offset: index * prev.limit,
                  }))
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        <PaginationItem>
          <PaginationNext
            onClick={(event) => {
              event.preventDefault()
              onChange((prev) => ({
                ...prev,
                offset: Math.min(
                  (totalPages - 1) * prev.limit,
                  prev.offset + prev.limit
                ),
              }))
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
