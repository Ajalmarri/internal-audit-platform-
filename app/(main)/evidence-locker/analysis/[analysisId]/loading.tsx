import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
export default function AiAnalysisResultLoading() {
  // The skeleton is now part of the page.tsx for simplicity with client-side data fetching.
  // This file can be minimal or use the same skeleton if preferred for route group loading.
  // For this example, we'll rely on the skeleton within page.tsx.
  // You could also re-export the skeleton component from page.tsx if you want to keep this file separate.
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="h-10 w-48 bg-muted rounded animate-pulse mb-6"></div>
      <Card>
        <CardHeader>
          <div className="h-8 w-3/4 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-6 w-1/4 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-6 w-1/3 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
