import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const actionItems = [
  { id: "AI-001", title: "Review Q3 Financial Controls", dueDate: "2024-08-15", priority: "High" },
  { id: "AI-002", title: "Approve new vendor contract", dueDate: "2024-08-20", priority: "Medium" },
  { id: "AI-003", title: "Submit risk assessment for Project X", dueDate: "2024-09-01", priority: "Medium" },
  { id: "AI-004", title: "Complete cybersecurity training", dueDate: "2024-08-30", priority: "Low" },
]

export function MyActionItemsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Action Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actionItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.priority === "High" ? "destructive" : item.priority === "Medium" ? "secondary" : "outline"
                    }
                  >
                    {item.priority}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild variant="ghost" size="sm">
          <Link href="#">
            View All Action Items <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
