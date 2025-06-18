import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LoadingActionPlansPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-48" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <Skeleton className="h-5 w-full" />
                </TableHead>
                <TableHead className="min-w-[250px]">
                  <Skeleton className="h-5 w-full" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-full" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-full" />
                </TableHead>
                <TableHead className="w-[150px]">
                  <Skeleton className="h-5 w-full" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-full" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-5 w-full" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 flex-grow" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
