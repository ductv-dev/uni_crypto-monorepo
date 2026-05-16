"use client"

import {
  EOrderSide,
  EOrderStatus,
  EOrderType,
  TFilterOrderBook,
} from "@/types/transactions/order-book.type"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Filter, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"

type TFilterOrderBookProps = {
  filter: TFilterOrderBook
  onApply: (filter: TFilterOrderBook) => void
}

const DEFAULT_ORDER_BOOK_FILTER: TFilterOrderBook = {
  status: undefined,
  side: undefined,
  type: undefined,
}

export const FilterOrderBook: React.FC<TFilterOrderBookProps> = ({
  filter,
  onApply,
}) => {
  const [filterState, setFilterState] = useState<TFilterOrderBook>(filter)

  useEffect(() => {
    setFilterState(filter)
  }, [filter])

  const handleReset = () => {
    setFilterState(DEFAULT_ORDER_BOOK_FILTER)
  }
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>Order Book Filters</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar space-y-4 overflow-y-auto px-4 pb-2">
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={filterState.status ?? "ALL"}
              onValueChange={(value) =>
                setFilterState((prev) => ({
                  ...prev,
                  status: value === "ALL" ? undefined : (value as EOrderStatus),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value={EOrderStatus.OPEN}>Open</SelectItem>
                <SelectItem value={EOrderStatus.FILLED}>Filled</SelectItem>
                <SelectItem value={EOrderStatus.CANCELLED}>
                  Cancelled
                </SelectItem>
                <SelectItem value={EOrderStatus.PARTIAL_FILLED}>
                  Partial Filled
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Side</FieldLabel>
            <Select
              value={filterState.side ?? "ALL"}
              onValueChange={(value) =>
                setFilterState((prev) => ({
                  ...prev,
                  side: value === "ALL" ? undefined : (value as EOrderSide),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sides</SelectItem>
                <SelectItem value={EOrderSide.BUY}>Buy</SelectItem>
                <SelectItem value={EOrderSide.SELL}>Sell</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select
              value={filterState.type ?? "ALL"}
              onValueChange={(value) =>
                setFilterState((prev) => ({
                  ...prev,
                  type: value === "ALL" ? undefined : (value as EOrderType),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value={EOrderType.LIMIT}>Limit</SelectItem>
                <SelectItem value={EOrderType.MARKET}>Market</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <DrawerFooter className="flex-row justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            onClick={() => {
              onApply(filterState)
              setIsOpen(false)
            }}
          >
            Apply Filters
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
