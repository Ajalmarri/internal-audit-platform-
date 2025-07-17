"use client"

import { useState, useEffect, useMemo } from "react"
import ActivityLogItem from "./activity-log-item"
import { type ActivityLogEntry, type ActivityLogFilters, mockActivityLogs } from "../_types/activity-log-types"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ActivityLogListProps {
  filters: ActivityLogFilters
}

const ITEMS_PER_PAGE = 10

export default function ActivityLogList({ filters }: ActivityLogListProps) {
  const [displayedLogs, setDisplayedLogs] = useState<ActivityLogEntry[]>([])
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)

  const filteredLogs = useMemo(() => {
    return mockActivityLogs
      .filter((log) => {
        if (filters.searchTerm && !log.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          return false
        }
        if (filters.userId && log.user.id !== filters.userId) {
          return false
        }
        if (filters.actionTypes && filters.actionTypes.length > 0 && !filters.actionTypes.includes(log.actionType)) {
          return false
        }
        if (filters.itemType && log.itemType !== filters.itemType) {
          return false
        }
        if (filters.dateRange?.from && log.timestamp < filters.dateRange.from) {
          return false
        }
        if (filters.dateRange?.to) {
          // Adjust 'to' date to include the whole day
          const toDate = new Date(filters.dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (log.timestamp > toDate) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) // Sort by newest first
  }, [filters])

  useEffect(() => {
    setDisplayedLogs(filteredLogs.slice(0, visibleCount))
  }, [filteredLogs, visibleCount])

  const handleLoadMore = () => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE)
      setIsLoading(false)
    }, 500)
  }

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [filters])

  if (
    filteredLogs.length === 0 &&
    Object.keys(filters).length > 0 &&
    !filters.searchTerm &&
    !filters.userId &&
    !filters.actionTypes?.length &&
    !filters.itemType &&
    !filters.dateRange
  ) {
    // Initial load, no filters applied yet, show all logs
  } else if (filteredLogs.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No activity logs match the current filters.</p>
  }

  return (
    <div>
      {displayedLogs.map((entry) => (
        <ActivityLogItem key={entry.id} entry={entry} />
      ))}
      {visibleCount < filteredLogs.length && (
        <div className="mt-6 text-center">
          <Button onClick={handleLoadMore} disabled={isLoading} variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Logs"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
