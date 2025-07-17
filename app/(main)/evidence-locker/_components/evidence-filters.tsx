"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FilterIcon, SearchIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import type { EvidenceFilters } from "../_types/evidence-types"

interface EvidenceFiltersProps {
  onFilterChange: (filters: EvidenceFilters) => void
  initialFilters?: EvidenceFilters
  // Mock data for filter options - replace with actual data fetching
  assignments: Array<{ id: string; title: string }>
  uploaders: Array<{ id: string; name: string }>
  evidenceTypes: string[]
}

export function EvidenceFiltersComponent({
  onFilterChange,
  initialFilters = {},
  assignments,
  uploaders,
  evidenceTypes,
}: EvidenceFiltersProps) {
  const [filters, setFilters] = useState<EvidenceFilters>(initialFilters)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleInputChange = (name: keyof EvidenceFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyFilters = () => {
    onFilterChange(filters)
    setIsPopoverOpen(false)
  }

  const handleClearFilters = () => {
    const clearedFilters: EvidenceFilters = { searchTerm: filters.searchTerm } // Keep search term
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
    setIsPopoverOpen(false)
  }

  const activeFilterCount = Object.values(filters).filter(
    (value) =>
      value !== undefined &&
      value !== "" &&
      value !== null &&
      !["searchTerm"].includes(
        Object.keys(filters).find((key) => filters[key as keyof EvidenceFilters] === value) || "",
      ),
  ).length

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative w-full sm:max-w-xs">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, content, tag..."
          value={filters.searchTerm || ""}
          onChange={(e) => handleInputChange("searchTerm", e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleApplyFilters()}
          className="pl-10 w-full"
        />
      </div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Advanced Filters</h4>

            <div>
              <label htmlFor="assignmentId" className="text-sm font-medium">
                Assignment
              </label>
              <Select
                value={filters.assignmentId || ""}
                onValueChange={(value) => handleInputChange("assignmentId", value)}
              >
                <SelectTrigger id="assignmentId">
                  <SelectValue placeholder="Select Assignment" />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((assignment) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="uploaderId" className="text-sm font-medium">
                Uploader
              </label>
              <Select
                value={filters.uploaderId || ""}
                onValueChange={(value) => handleInputChange("uploaderId", value)}
              >
                <SelectTrigger id="uploaderId">
                  <SelectValue placeholder="Select Uploader" />
                </SelectTrigger>
                <SelectContent>
                  {uploaders.map((uploader) => (
                    <SelectItem key={uploader.id} value={uploader.id}>
                      {uploader.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="evidenceType" className="text-sm font-medium">
                Evidence Type
              </label>
              <Select
                value={filters.evidenceType || ""}
                onValueChange={(value) => handleInputChange("evidenceType", value)}
              >
                <SelectTrigger id="evidenceType">
                  <SelectValue placeholder="Select Evidence Type" />
                </SelectTrigger>
                <SelectContent>
                  {evidenceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="findingId" className="text-sm font-medium">
                Finding ID
              </label>
              <Input
                id="findingId"
                placeholder="Enter Finding ID"
                value={filters.findingId || ""}
                onChange={(e) => handleInputChange("findingId", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date Uploaded</label>
              <div className="flex gap-2">
                <DatePicker
                  date={filters.uploadDateStart}
                  setDate={(date) => handleInputChange("uploadDateStart", date)}
                  placeholderText="Start Date"
                />
                <DatePicker
                  date={filters.uploadDateEnd}
                  setDate={(date) => handleInputChange("uploadDateEnd", date)}
                  placeholderText="End Date"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={handleClearFilters} size="sm">
                Clear
              </Button>
              <Button onClick={handleApplyFilters} size="sm">
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
        Search
      </Button>
    </div>
  )
}
