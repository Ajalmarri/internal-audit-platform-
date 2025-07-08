import { Skeleton } from "@/components/ui/skeleton"

export default function AuditUniverseLoading() {
  return (
    <div className="h-[calc(100vh-var(--header-height,80px))] w-full flex flex-col">
      <header className="p-4 border-b bg-background">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </header>
      <div className="flex-grow relative">
        {/* Simulate a few nodes */}
        <Skeleton className="absolute h-24 w-48 rounded-lg" style={{ top: "20%", left: "30%" }} />
        <Skeleton className="absolute h-24 w-48 rounded-lg" style={{ top: "50%", left: "50%" }} />
        <Skeleton className="absolute h-24 w-48 rounded-lg" style={{ top: "30%", left: "70%" }} />
        <div className="absolute bottom-4 left-4 space-y-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-24 w-36 rounded-md" />
        </div>
      </div>
    </div>
  )
}
