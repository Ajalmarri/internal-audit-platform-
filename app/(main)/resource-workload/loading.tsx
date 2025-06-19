import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ResourceWorkloadLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-pulse">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-4 w-4/5 mt-1" />
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-44" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-40 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10 w-[200px]">
                    <Skeleton className="h-5 w-24" />
                  </TableHead>
                  {[...Array(6)].map((_, i) => (
                    <TableHead key={i} className="text-center min-w-[120px]">
                      <Skeleton className="h-5 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(4)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="sticky left-0 bg-background z-10 font-medium w-[200px]">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-28" />
                      </div>
                      <Skeleton className="h-3 w-20 mt-1" />
                    </TableCell>
                    {[...Array(6)].map((_, cellIndex) => (
                      <TableCell key={cellIndex} className="text-center p-1">
                        <Skeleton className="h-10 w-20 mx-auto rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
