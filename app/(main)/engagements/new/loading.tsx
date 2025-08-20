import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

export default function NewEngagementLoading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-3xl">
      <Skeleton className="h-9 w-24 mb-6" /> {/* Back button */}
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/5 mb-2" /> {/* CardTitle */}
          <Skeleton className="h-4 w-4/5" /> {/* CardDescription */}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" /> {/* Label */}
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" /> {/* Label */}
            <Skeleton className="h-24 w-full" /> {/* Textarea */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Select */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Select */}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* DatePicker */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* DatePicker */}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" /> {/* Cancel Button */}
          <Skeleton className="h-10 w-36" /> {/* Submit Button */}
        </CardFooter>
      </Card>
    </div>
  )
}
