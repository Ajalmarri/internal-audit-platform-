"use client"

import { useState } from "react"
import ActivityFilters from "./_components/activity-filters"
import ActivityLogList from "./_components/activity-log-list"
import type { ActivityLogFilters } from "./_types/activity-log-types"
import { History } from "lucide-react"

export default function GlobalActivityLogPage() {
  const [filters, setFilters] = useState<ActivityLogFilters>({})

  const handleFiltersChange = (newFilters: ActivityLogFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <History className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Global Activity Log</h1>
        </div>
        <p className="text-muted-foreground">A detailed, unchangeable record of all system and user activities.</p>
      </header>

      <ActivityFilters onFiltersChange={handleFiltersChange} initialFilters={filters} />

      <main>
        <ActivityLogList filters={filters} />
      </main>
    </div>
  )
}
