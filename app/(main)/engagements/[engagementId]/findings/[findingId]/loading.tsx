// app/(main)/engagements/[engagementId]/findings/[findingId]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function FindingDetailLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-6 w-40 mb-2" /> {/* Back button */}
          <Skeleton className="h-10 w-3/4 md:w-96 mb-1" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Subtitle */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" /> {/* Status Badge */}
          <Skeleton className="h-10 w-32" /> {/* Edit Button */}
        </div>
      </div>
      <Skeleton className="h-px w-full" /> {/* Separator */}
      {/* Main Content Grid Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column Skeleton */}
        <div className="md:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border rounded-lg">
              <Skeleton className="h-6 w-1/3 mb-4" /> {/* Card Title */}
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>

        {/* Right Column Skeleton */}
        <div className="md:col-span-1 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 border rounded-lg">
              <Skeleton className="h-6 w-1/2 mb-6" /> {/* Card Title */}
              <div className="space-y-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
