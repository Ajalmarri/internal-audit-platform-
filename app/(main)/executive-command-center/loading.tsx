import { Skeleton } from "@/components/ui/skeleton"

export default function ExecutiveCommandCenterLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-9 w-1/3" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Compliance Status Widget Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" /> {/* Title */}
          <Skeleton className="h-48 w-full" /> {/* Content */}
        </div>

        {/* Risk Trend Widget Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" /> {/* Title */}
          <Skeleton className="h-6 w-3/4" /> {/* Description */}
          <Skeleton className="h-[300px] w-full" /> {/* Chart Area */}
        </div>

        {/* Audit Plan Performance Widget Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" /> {/* Title */}
          <Skeleton className="h-4 w-full mb-2" /> {/* Progress Bar */}
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" /> {/* Stat 1 */}
            <Skeleton className="h-16 w-full" /> {/* Stat 2 */}
          </div>
        </div>

        {/* Resource Allocation Widget Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" /> {/* Title */}
          <Skeleton className="h-6 w-3/4" /> {/* Description */}
          <Skeleton className="h-[300px] w-full" /> {/* Chart Area */}
        </div>
      </div>
    </div>
  )
}
