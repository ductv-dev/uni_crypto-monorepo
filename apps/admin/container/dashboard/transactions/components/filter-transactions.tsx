"use client"

import { TFilters } from "@/hooks/transactions/use-transactions"
import {
  ERiskLevel,
  ETransactionStatus,
  ETransactionType,
} from "@/types/transaction.type"
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
import { useState } from "react"

type Props = {
  filter: TFilters
  setFilter: (filter: TFilters) => void
}

export const FilterTransactions: React.FC<Props> = ({ filter, setFilter }) => {
  const [filterState, setFilterState] = useState<TFilters>(filter)

  const handleReset = () => {
    const resetFilter: TFilters = {
      type: undefined,
      status: undefined,
      riskLevel: undefined,
      startDate: undefined,
      endDate: undefined,
      tokenSymbol: "",
      network: "",
      shortBy: "createdAt",
      shortDirection: "desc",
    }
    setFilterState(resetFilter)
  }

  const handleSubmit = () => {
    setFilter(filterState)
  }

  return (
    <Drawer onClose={handleSubmit} direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Advanced Filter
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Filter Transactions</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Date Range */}
            {/* <Field>
              <FieldLabel>Start Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterState.startDate ? (
                      format(parseISO(filterState.startDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filterState.startDate
                        ? parseISO(filterState.startDate)
                        : undefined
                    }
                    onSelect={(d) =>
                      setFilterState({
                        ...filterState,
                        startDate: d ? format(d, "yyyy-MM-dd") : undefined,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field>
              <FieldLabel>End Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterState.endDate ? (
                      format(parseISO(filterState.endDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filterState.endDate
                        ? parseISO(filterState.endDate)
                        : undefined
                    }
                    onSelect={(d) =>
                      setFilterState({
                        ...filterState,
                        endDate: d ? format(d, "yyyy-MM-dd") : undefined,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field> */}

            {/* Selects */}
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select
                value={filterState.type || "ALL"}
                onValueChange={(v) =>
                  setFilterState({
                    ...filterState,
                    type: v === "ALL" ? undefined : (v as ETransactionType),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {Object.values(ETransactionType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={filterState.status || "ALL"}
                onValueChange={(v) =>
                  setFilterState({
                    ...filterState,
                    status: v === "ALL" ? undefined : (v as ETransactionStatus),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  {Object.values(ETransactionStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Risk Level</FieldLabel>
              <Select
                value={filterState.riskLevel || "ALL"}
                onValueChange={(v) =>
                  setFilterState({
                    ...filterState,
                    riskLevel: v === "ALL" ? undefined : (v as ERiskLevel),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Risk Levels</SelectItem>
                  {Object.values(ERiskLevel).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Inputs */}
            <Field>
              <FieldLabel>Token Symbol</FieldLabel>
              <Input
                placeholder="BTC, USDT, etc."
                value={filterState.tokenSymbol || ""}
                onChange={(e) =>
                  setFilterState({
                    ...filterState,
                    tokenSymbol: e.target.value,
                  })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Network</FieldLabel>
              <Input
                placeholder="ERC20, TRC20, etc."
                value={filterState.network || ""}
                onChange={(e) =>
                  setFilterState({ ...filterState, network: e.target.value })
                }
              />
            </Field>
          </div>
        </div>
        <DrawerFooter className="flex-row justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button onClick={handleSubmit}>Apply Filters</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
