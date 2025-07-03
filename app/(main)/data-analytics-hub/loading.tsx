import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="text-center">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
      </header>
      <section>
        <Skeleton className="h-8 w-1/3 mx-auto mb-6" />
        <div className="flex flex-wrap justify-center gap-6">
          {[...Array(1)].map(
            (
              _,
              i, // Assuming at least one data source card might show
            ) => (
              <div key={i} className="w-full max-w-sm space-y-3 p-4 border rounded-lg">
                <Skeleton className="h-12 w-1/2 mx-auto" /> {/* Logo placeholder */}
                <Skeleton className="h-6 w-3/4 mx-auto" /> {/* Title */}
                <Skeleton className="h-4 w-full mx-auto" /> {/* Description */}
                <Skeleton className="h-4 w-full mx-auto" />
                <Skeleton className="h-10 w-full mt-4" /> {/* Button */}
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  )
}
