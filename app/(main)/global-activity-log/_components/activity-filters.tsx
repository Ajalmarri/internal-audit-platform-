"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range" // Assuming this exists or you'll create it
import type { DateRange } from "react-day-picker"
import {
  type ActivityLogFilters,
  type ActionType,
  type ItemType,
  mockUsers,
  mockActionTypes,
  mockItemTypes,
} from "../_types/activity-log-types"
import { Check, ChevronsUpDown, FilterX, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityFiltersProps {
  onFiltersChange: (filters: ActivityLogFilters) => void
  initialFilters?: ActivityLogFilters
}

export default function ActivityFilters({ onFiltersChange, initialFilters = {} }: ActivityFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "")
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(initialFilters.userId)
  const [selectedActionTypes, setSelectedActionTypes] = useState<ActionType[]>(initialFilters.actionTypes || [])
  const [selectedItemType, setSelectedItemType] = useState<ItemType | undefined>(initialFilters.itemType)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange)

  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleApplyFilters = () => {
    onFiltersChange({
      searchTerm,
      userId: selectedUserId,
      actionTypes: selectedActionTypes.length > 0 ? selectedActionTypes : undefined,
      itemType: selectedItemType,
      dateRange,
    })
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedUserId(undefined)
    setSelectedActionTypes([])
    setSelectedItemType(undefined)
    setDateRange(undefined)
    onFiltersChange({})
  }

  const getSelectedUserName = () => {
    if (!selectedUserId) return "Select User..."
    return mockUsers.find((user) => user.id === selectedUserId)?.name || "Select User..."
  }

  const toggleActionType = (actionType: ActionType) => {
    setSelectedActionTypes((prev) =>
      prev.includes(actionType) ? prev.filter((at) => at !== actionType) : [...prev, actionType],
    )
  }

  return (
    <div className="p-4 mb-6 bg-card border rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
        {/* Search Term */}
        <div className="xl:col-span-1">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-muted-foreground mb-1">
            Search Log
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchTerm"
              placeholder="Search descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* User Filter */}
        <div>
          <label htmlFor="userFilter" className="block text-sm font-medium text-muted-foreground mb-1">
            User
          </label>
          <Popover open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={userDropdownOpen}
                className="w-full justify-between"
              >
                {getSelectedUserName()}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search user..." />
                <CommandList>
                  <CommandEmpty>No user found.</CommandEmpty>
                  <CommandGroup>
                    {mockUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.name}
                        onSelect={() => {
                          setSelectedUserId(user.id === selectedUserId ? undefined : user.id)
                          setUserDropdownOpen(false)
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedUserId === user.id ? "opacity-100" : "opacity-0")}
                        />
                        {user.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Action Type Filter (Multi-select) */}
        <div>
          <label htmlFor="actionTypeFilter" className="block text-sm font-medium text-muted-foreground mb-1">
            Action Type
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedActionTypes.length > 0 ? `${selectedActionTypes.length} selected` : "Select Action Types..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuLabel>Filter by Action Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockActionTypes.map((actionType) => (
                <DropdownMenuCheckboxItem
                  key={actionType}
                  checked={selectedActionTypes.includes(actionType)}
                  onCheckedChange={() => toggleActionType(actionType)}
                >
                  {actionType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Item Type Filter */}
        <div>
          <label htmlFor="itemTypeFilter" className="block text-sm font-medium text-muted-foreground mb-1">
            Item Type
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {selectedItemType || "Select Item Type..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search item type..." />
                <CommandList>
                  <CommandEmpty>No item type found.</CommandEmpty>
                  <CommandGroup>
                    {mockItemTypes.map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={(currentValue) => {
                          setSelectedItemType(currentValue === selectedItemType ? undefined : item)
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedItemType === item ? "opacity-100" : "opacity-0")}
                        />
                        {item}
                      </CommandItem>
                    ))}
                    {selectedItemType && (
                      <CommandItem
                        key="clear-itemtype"
                        value="clear-itemtype"
                        onSelect={() => setSelectedItemType(undefined)}
                        className="text-destructive"
                      >
                        <X className="mr-2 h-4 w-4" /> Clear selection
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Filter */}
        <div className="xl:col-span-1">
          <label htmlFor="dateRangeFilter" className="block text-sm font-medium text-muted-foreground mb-1">
            Date Range
          </label>
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="w-full" />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <Button variant="outline" onClick={handleClearFilters} className="w-full sm:w-auto">
          <FilterX className="mr-2 h-4 w-4" /> Clear Filters
        </Button>
        <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
