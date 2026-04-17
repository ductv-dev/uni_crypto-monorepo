"use client"
import { CardToken1 } from "@/components/custom/cards/card-token-1"
import { CardToken2 } from "@/components/custom/cards/card-token-2"

import { LIST_TOKEN } from "@/data/mock-data-list-token"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  ChartLine,
  ChartNoAxesCombined,
  ChartPie,
  ChevronsDownUp,
  ChevronsUpDown,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { TToken } from "shared/src/types"
import { BottomSheetSearch } from "./bottom-sheet/bottom-sheet-search"

const OPTION_SELECT = [
  {
    label: "Khối lượng",
    icon: <ChartNoAxesCombined />,
    value: "khoi_luong",
  },
  {
    label: "TVL Uni",
    icon: <ChartLine />,
    value: "tvl_uni",
  },
  {
    label: "Vốn hóa thị trường",
    icon: <ChartPie />,
    value: "von_hoa_thi_truong",
  },
  {
    label: "Giá tăng(24H)",
    icon: <TrendingUp />,
    value: "gia_tang_24h",
  },
  {
    label: "Giá giảm(24H)",
    icon: <TrendingDown />,
    value: "gia_giam_24h",
  },
]

export const SearchPage = () => {
  const [sortBy, setSortBy] = useState(OPTION_SELECT?.[0]?.value)
  const [quantityFavorite, setQuantityFavorite] = useState(4)
  const route = useRouter()

  const sortedTokens = useMemo(() => {
    return [...LIST_TOKEN].sort((a: TToken, b: TToken) => {
      switch (sortBy) {
        case "khoi_luong":
          return b.usdt - a.usdt
        case "tvl_uni":
          return b.decimals - a.decimals
        case "von_hoa_thi_truong":
          return b.usdt * 1_000_000 - a.usdt * 1_000_000
        case "gia_tang_24h":
          return (b.number_changes ?? 0) - (a.number_changes ?? 0)
        case "gia_giam_24h":
          return (a.number_changes ?? 0) - (b.number_changes ?? 0)
        default:
          return 0
      }
    })
  }, [sortBy])

  const favoriteTokens = useMemo(() => {
    return LIST_TOKEN.slice(0, quantityFavorite)
  }, [quantityFavorite])

  return (
    <div className="h-full w-full">
      {/* Field tìm kiếm */}
      <div className="fixed top-0 z-50 mx-auto w-full max-w-xl bg-background p-2.5 lg:static">
        <BottomSheetSearch />
      </div>

      <div className="mt-20 w-full gap-2.5 px-2.5 pb-20 lg:mt-0 lg:flex lg:gap-5">
        {/* List token yêu thích */}
        <div className="lg:w-[380px]">
          <div className="sticky top-0 flex flex-col gap-2">
            <p className="font-semibold text-foreground/60">Token yêu thích</p>

            <div className="grid grid-cols-2 gap-2.5">
              {favoriteTokens.map((token) => (
                <CardToken2
                  onClick={() => route.push(`/token/${token.symbol}`)}
                  key={token.address}
                  name={token.name}
                  image={token.logoURI}
                  symbol={token.symbol}
                />
              ))}
            </div>
            <div className="flex items-center gap-2.5 px-2.5 py-2 text-foreground/60">
              <p className="h-px flex-1 bg-accent"></p>

              {quantityFavorite === 4 ? (
                <button
                  onClick={() => setQuantityFavorite(6)}
                  className="flex items-center gap-1"
                >
                  <p>Hiện thêm</p>
                  <ChevronsUpDown className="" size={14} />
                </button>
              ) : (
                <button
                  onClick={() => setQuantityFavorite(4)}
                  className="flex items-center gap-1"
                >
                  <p>Thu lại</p>
                  <ChevronsDownUp className="" size={14} />
                </button>
              )}
              <p className="h-px flex-1 bg-accent"></p>
            </div>
          </div>
        </div>
        {/* List token hàng đầu */}
        <div className="flex flex-1 flex-col gap-2">
          {/* Bộ lọc */}
          <div className="flex items-center">
            <p className="flex-1 font-semibold text-foreground/60">
              Token hàng đầu
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {OPTION_SELECT.map((option, index) => (
                    <SelectItem key={index} value={option.value}>
                      <div className="flex items-center gap-1">
                        <div>{option.icon}</div>
                        <p>{option.label}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Danh sách token */}
          <div>
            {sortedTokens.map((token, index) => (
              <CardToken1
                onClick={() => route.push(`/token/${token.symbol}`)}
                rank={index + 1}
                name={token.name}
                symbol={token.symbol}
                image={token.logoURI}
                key={token.address}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
