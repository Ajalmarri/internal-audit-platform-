import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CustomReportBuilderLoading() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Skeleton className="h-9 w-72 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Step Indicator Skeleton */}
      <div className="mb-8 p-4 border rounded-lg bg-card">
        <div className="flex items-center w-full">
          {[1, 2, 3].map((_, index, arr) => (
            <React.Fragment key={index}>
              <li className="flex items-center text-muted-foreground">
                <Skeleton className="w-8 h-8 rounded-full mr-2 shrink-0" />
                <Skeleton className="h-5 w-24 hidden sm:inline-block" />
              </li>
              {index < arr.length - 1 && <li className="flex-auto border-t-2 mx-4 border-muted-foreground"></li>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1 Skeleton (Default View) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Step 2 & 3 Skeleton (Conceptual - would show if step > 1) */}
      <div className="space-y-8 hidden">
        {" "}
        {/* Hidden by default, shown conditionally */}
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-40 w-full" /> {/* Placeholder for filters */}
        </div>
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-64 w-full" /> {/* Placeholder for table preview */}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
