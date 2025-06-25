export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-muted rounded-md"></div>
        <div>
          <div className="h-7 w-48 bg-muted rounded-md mb-1"></div>
          <div className="h-5 w-64 bg-muted rounded-md"></div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="h-6 w-3/4 bg-muted rounded-md"></div>
              <div className="h-4 w-1/2 bg-muted rounded-md"></div>
            </div>
            <div className="p-6 pt-0 space-y-2">
              <div className="h-4 w-full bg-muted rounded-md"></div>
              <div className="h-4 w-5/6 bg-muted rounded-md"></div>
              <div className="h-4 w-full bg-muted rounded-md"></div>
            </div>
          </div>
        ))}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm md:col-span-2 lg:col-span-3">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="h-6 w-1/4 bg-muted rounded-md"></div>
            <div className="h-4 w-1/3 bg-muted rounded-md"></div>
          </div>
          <div className="p-6 pt-0">
            <div className="h-24 w-full bg-muted rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
