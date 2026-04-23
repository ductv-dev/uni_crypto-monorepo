"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { TTradePagination } from "../types"

type TTradesPaginationProps = {
  pagination: TTradePagination
  totalPages: number
  onChange: React.Dispatch<React.SetStateAction<TTradePagination>>
}

export const TradesPagination: React.FC<TTradesPaginationProps> = ({
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
            className={
              pagination.offset === 0
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={(event) => {
              event.preventDefault()
              if (pagination.offset > 0) {
                onChange((prev) => ({
                  ...prev,
                  offset: Math.max(0, prev.offset - prev.limit),
                }))
              }
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => {
          const isActive =
            Math.floor(pagination.offset / pagination.limit) === index

          return (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={isActive}
                className="cursor-pointer"
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
            className={
              pagination.offset >= (totalPages - 1) * pagination.limit
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={(event) => {
              event.preventDefault()
              if (pagination.offset < (totalPages - 1) * pagination.limit) {
                onChange((prev) => ({
                  ...prev,
                  offset: prev.offset + prev.limit,
                }))
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
