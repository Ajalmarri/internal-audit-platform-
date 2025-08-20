import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { History } from "lucide-react"

export default function LoadingGlobalActivityLog() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <History className="h-8 w-8 text-primary" />
          <Skeleton className="h-9 w-72" />
        </div>
        <Skeleton className="h-5 w-full max-w-md" />
      </header>

      {/* Filters Skeleton */}
      <div className="p-4 mb-6 bg-card border rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-5 w-20 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Log List Skeleton */}
      <div>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="mb-3">
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="flex flex-col items-center pt-1">
                <Skeleton className="h-10 w-10 rounded-full mb-1" />
                <Skeleton className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
