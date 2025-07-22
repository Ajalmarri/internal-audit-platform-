export default function BusinessOwnerLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
        <div className="h-5 w-96 bg-muted rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-2 xl:col-span-2">
          <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="lg:col-span-2 xl:col-span-2">
          <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-4">
          <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="col-span-1 lg:col-span-2 xl:col-span-4">
          <div className="h-32 bg-muted rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
