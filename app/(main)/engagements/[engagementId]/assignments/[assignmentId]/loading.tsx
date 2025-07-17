import { Skeleton } from "@/components/ui/skeleton"

export default function EngagementAssignmentDetailLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Back button */}
          <div>
            <Skeleton className="h-8 w-72 mb-2 rounded" /> {/* Title */}
            <Skeleton className="h-5 w-48 rounded" /> {/* Status and Engagement ID */}
          </div>
        </div>
        <Skeleton className="h-10 w-36 rounded-md" /> {/* Edit button */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="space-y-2 p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/3 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>

          {/* Tasks Card */}
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/4 rounded mb-4" />
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-64 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>

          {/* Documents Card */}
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/4 rounded mb-4" />
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-56 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
          </div>

          {/* Comments Card */}
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/4 rounded mb-4" />
            <div className="p-3 border rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
              <Skeleton className="h-4 w-full rounded" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Details Card */}
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/3 rounded mb-4" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-2 rounded" />
                <Skeleton className="h-4 w-3/4 ml-4 rounded" />
                <Skeleton className="h-4 w-2/3 ml-4 mt-1 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
