"use client"

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
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Filter, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { DEFAULT_USER_FILTER, TUserFilter } from "../types"

type TFilterUsersProps = {
  filter: TUserFilter
  onApply: (filter: TUserFilter) => void
}

const USER_STATUS_OPTIONS = [
  { label: "All Status", value: "ALL" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "Block", value: "block" },
]

export const FilterUsers: React.FC<TFilterUsersProps> = ({
  filter,
  onApply,
}) => {
  const [filterState, setFilterState] = useState<TUserFilter>(filter)

  useEffect(() => {
    setFilterState(filter)
  }, [filter])

  const handleReset = () => {
    setFilterState(DEFAULT_USER_FILTER)
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
          <DrawerTitle>Advanced Filters</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar space-y-4 overflow-y-auto px-4 pb-2">
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={filterState.status || "ALL"}
              onValueChange={(value) =>
                setFilterState((prev) => ({
                  ...prev,
                  status: value === "ALL" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {USER_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Country</FieldLabel>
            <Input
              placeholder="Vietnam, Singapore..."
              value={filterState.country}
              onChange={(event) =>
                setFilterState((prev) => ({
                  ...prev,
                  country: event.target.value,
                }))
              }
            />
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
