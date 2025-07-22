import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BusinessOwnerDashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
        <div className="h-7 w-48 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="lg:col-span-2 xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-2 xl:col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-2 xl:col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
