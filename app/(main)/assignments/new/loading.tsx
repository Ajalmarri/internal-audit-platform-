import { Skeleton } from "@/components/ui/skeleton"

export default function CreateNewAssignmentLoading() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 animate-pulse">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Skeleton className="h-12 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Process Tracker */}
      <div className="mb-6">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              {index < 4 && <Skeleton className="h-1 flex-1 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Fulfilment / Tasks Card */}
          <div className="p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Related Risks & Controls Card */}
          <div className="p-6 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Your Requirement Card */}
          <div className="p-6 border rounded-lg">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-1 mb-3">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>

          {/* Assigned Team Card */}
          <div className="p-6 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
