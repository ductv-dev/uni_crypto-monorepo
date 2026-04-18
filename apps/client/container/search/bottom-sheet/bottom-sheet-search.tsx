"use client"

import { CardToken1 } from "@/components/custom/cards/card-token-1"
import { SkeletonCardToken1 } from "@/components/custom/skeleton/skeleton-card-token-1"
import { useSearchTokens } from "@/lib/hooks/use-search"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"

import { ChevronLeft, Search, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TToken } from "@workspace/shared/types"

export const BottomSheetSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const route = useRouter()
  const { data, isLoading, error } = useSearchTokens(searchQuery)
  const normalizedQuery = searchQuery.trim()

  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (drawerOpen) {
      setTimeout(() => {
        const inputElement = document.getElementById(
          "search-token"
        ) as HTMLInputElement
        inputElement.focus()
      }, 100)
    }
  }, [drawerOpen])

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger className="w-full">
        <div className="flex flex-1 gap-2 rounded-full border-t border-border bg-background p-2.5 shadow-md shadow-border">
          <Search />
          <p>Nhập từ khóa tìm kiếm</p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-full">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-1 py-2.5">
            <DrawerClose className="px-2">
              <ChevronLeft className="text-foreground" />
            </DrawerClose>
            <InputGroup className="h-12 w-full rounded-full">
              <InputGroupInput
                className="h-12"
                id="search-token"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
            <div className="size-12"></div>
          </div>

          <div className="no-scrollbar w-full overflow-y-auto px-2.5">
            <div className="flex w-full flex-col items-center justify-center gap-2.5 py-2">
              {isLoading ? (
                <div className="flex w-full flex-col gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonCardToken1 key={index} />
                  ))}
                </div>
              ) : error ? (
                <p className="text-sm text-destructive">
                  Lỗi tìm kiếm. Vui lòng thử lại.
                </p>
              ) : !normalizedQuery ? (
                <p className="text-sm text-muted-foreground">
                  Nhập tên, ký hiệu hoặc địa chỉ token để tìm kiếm.
                </p>
              ) : data?.length ? (
                data.map((token: TToken) => (
                  <CardToken1
                    key={token.symbol}
                    onClick={() => {
                      setDrawerOpen(false)
                      route.push(`/token/${token.symbol}`)
                    }}
                    name={token.name}
                    symbol={token.symbol}
                    image={token.logoURI}
                    number_changes={token.number_changes}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Không có kết quả phù hợp.
                </p>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
