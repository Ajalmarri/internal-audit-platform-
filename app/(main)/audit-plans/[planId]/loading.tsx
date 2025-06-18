import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, ShieldCheck, Target } from "lucide-react"

export default function AuditPlanDetailLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-3/5 md:w-96" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Plan Overview Card Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Target className="mr-2 h-5 w-5 text-primary" /> <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-4 w-40 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked Assignments Card Skeleton */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <ClipboardList className="mr-2 h-5 w-5 text-primary" /> <Skeleton className="h-6 w-36" />
          </CardTitle>
          <Skeleton className="h-9 w-44" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2 border-b">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/6" />
                <Skeleton className="h-5 w-1/6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scope: Risks & Controls Card Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> <Skeleton className="h-6 w-52" />
          </CardTitle>
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
