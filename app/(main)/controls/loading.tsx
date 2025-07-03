import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"

export default function ControlsLoading() {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-background border-b p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-1" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-10 pl-8 w-full" />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Skeleton className="h-10 w-32 flex-grow sm:flex-grow-0" />
            <Skeleton className="h-10 w-32 flex-grow sm:flex-grow-0" />
            <Skeleton className="h-10 w-40 flex-grow sm:flex-grow-0" />
            <Skeleton className="h-10 w-40 flex-grow sm:flex-grow-0" />
          </div>
        </div>
        <Separator />
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-5 w-32" />
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Skeleton className="h-5 w-48" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-32" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-5 w-20 mx-auto" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-5 w-16 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-28" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}
