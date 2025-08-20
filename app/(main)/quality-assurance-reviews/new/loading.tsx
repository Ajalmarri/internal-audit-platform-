import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"

export default function NewQAReviewLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft size={16} />
        Back to QA Reviews
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Review Period */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>

          {/* Lead Reviewer */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>

          {/* Sampled Audits */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-3 w-3/4 mb-4" />
            <div className="h-72 w-full rounded-md border p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
