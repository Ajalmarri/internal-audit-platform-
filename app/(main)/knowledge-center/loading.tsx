import { Skeleton } from "@/components/ui/skeleton"

export default function KnowledgeCenterLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <header className="text-center md:text-left">
        <Skeleton className="h-10 w-3/4 md:w-1/2 mb-2" />
        <Skeleton className="h-5 w-full md:w-3/4" />
      </header>
      <Skeleton className="h-12 w-full rounded-lg" /> {/* Search bar */}
      <section>
        <Skeleton className="h-8 w-1/3 mb-4" /> {/* Category title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      </section>
      <section>
        <Skeleton className="h-8 w-1/2 mb-4" /> {/* Featured articles title */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  )
}
