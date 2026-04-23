"use client"

import {
  EWithdrawStatus,
  TWithdrawFilter,
} from "@/types/transactions/withdraw.type"
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

type TFilterWithdrawalsProps = {
  filter: TWithdrawFilter
  onApply: (filter: TWithdrawFilter) => void
}

const DEFAULT_WITHDRAWAL_FILTER: TWithdrawFilter = {
  status: undefined,
}

export const FilterWithdrawals: React.FC<TFilterWithdrawalsProps> = ({
  filter,
  onApply,
}) => {
  const [filterState, setFilterState] = useState<TWithdrawFilter>(filter)

  useEffect(() => {
    setFilterState(filter)
  }, [filter])

  const handleReset = () => {
    setFilterState(DEFAULT_WITHDRAWAL_FILTER)
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
          <DrawerTitle>Withdrawals Filters</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar space-y-4 overflow-y-auto px-4 pb-2">
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={filterState.status ?? "ALL"}
              onValueChange={(value) =>
                setFilterState((prev) => ({
                  ...prev,
                  status:
                    value === "ALL" ? undefined : (value as EWithdrawStatus),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value={EWithdrawStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={EWithdrawStatus.APPROVED}>
                  Approved
                </SelectItem>
                <SelectItem value={EWithdrawStatus.REJECTED}>
                  Rejected
                </SelectItem>
                <SelectItem value={EWithdrawStatus.COMPLETED}>
                  Completed
                </SelectItem>
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
