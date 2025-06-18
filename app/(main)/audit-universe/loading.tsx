import { Skeleton } from "@/components/ui/skeleton"

export default function AuditUniverseLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </header>
      <Skeleton className="h-12 w-full mb-6" /> {/* For Alert */}
      <div className="bg-card p-4 rounded-lg shadow">
        <Skeleton className="h-[550px] w-full" /> {/* For Treemap */}
      </div>
    </div>
  )
}
