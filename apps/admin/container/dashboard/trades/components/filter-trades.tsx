"use client"

import { TTradeFilter } from "@/types/transactions/trades.type"
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

type TFilterTradesProps = {
  filter: TTradeFilter
  onApply: (filter: TTradeFilter) => void
  pairOptions: string[]
}

const DEFAULT_TRADE_FILTER: TTradeFilter = {
  pair: undefined,
}

export const FilterTrades: React.FC<TFilterTradesProps> = ({
  filter,
  onApply,
  pairOptions,
}) => {
  const [filterState, setFilterState] = useState<TTradeFilter>(filter)

  useEffect(() => {
    setFilterState(filter)
  }, [filter])

  const handleReset = () => {
    setFilterState(DEFAULT_TRADE_FILTER)
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>Trade History Filters</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar space-y-4 overflow-y-auto px-4 pb-2">
          <Field>
            <FieldLabel>Pair</FieldLabel>
            <Select
              value={filterState.pair ?? "ALL"}
              onValueChange={(value) =>
                setFilterState((prev) => ({
                  ...prev,
                  pair: value === "ALL" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Pairs</SelectItem>
                {pairOptions.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
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
          <DrawerClose asChild>
            <Button onClick={() => onApply(filterState)}>Apply Filters</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
