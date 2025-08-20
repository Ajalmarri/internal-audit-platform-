import { Skeleton } from "@/components/ui/skeleton"

export default function ArticleLoading() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
      <Skeleton className="h-10 w-24 mb-6" /> {/* Back button */}
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-sm">
        <header className="mb-8 border-b pb-6">
          <Skeleton className="h-5 w-1/4 mb-2" /> {/* Category link */}
          <Skeleton className="h-12 w-3/4 mb-4" /> {/* Title */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Skeleton className="h-7 w-32" /> {/* Author */}
            <Skeleton className="h-5 w-48" /> {/* Last updated */}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </header>

        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    </div>
  )
}
