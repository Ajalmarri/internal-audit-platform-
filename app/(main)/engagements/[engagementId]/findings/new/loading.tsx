import { Skeleton } from "@/components/ui/skeleton"

export default function NewFindingLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-md" /> {/* Back button */}
        <div>
          <Skeleton className="h-8 w-64 mb-1" /> {/* Title */}
          <Skeleton className="h-4 w-48" /> {/* Subtitle */}
        </div>
      </div>

      <div className="border rounded-lg shadow-sm">
        {" "}
        {/* Card */}
        <div className="p-6 space-y-2 border-b">
          {" "}
          {/* CardHeader */}
          <Skeleton className="h-6 w-1/3" /> {/* CardTitle */}
          <Skeleton className="h-4 w-2/3" /> {/* CardDescription */}
        </div>
        <div className="p-6 space-y-8">
          {" "}
          {/* CardContent */}
          {/* Title Field */}
          <div>
            <Skeleton className="h-4 w-20 mb-2" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
            <Skeleton className="h-3 w-1/2 mt-1" /> {/* Description */}
          </div>
          {/* Description Field */}
          <div>
            <Skeleton className="h-4 w-24 mb-2" /> {/* Label */}
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
            <Skeleton className="h-3 w-2/3 mt-1" /> {/* Description */}
          </div>
          {/* Recommendation Field */}
          <div>
            <Skeleton className="h-4 w-32 mb-2" /> {/* Label */}
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
            <Skeleton className="h-3 w-3/4 mt-1" /> {/* Description */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {" "}
              {/* Severity */}
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </div>
            <div>
              {" "}
              {/* Status */}
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {" "}
              {/* Assigned To */}
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-2/3 mt-1" />
            </div>
            <div>
              {" "}
              {/* Due Date */}
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Skeleton className="h-10 w-24" /> {/* Cancel Button */}
            <Skeleton className="h-10 w-32" /> {/* Submit Button */}
          </div>
        </div>
      </div>
    </div>
  )
}
