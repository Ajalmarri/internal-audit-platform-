import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const actionItems = [
  {
    id: "AR-001",
    title: "Review Q2 Financial Controls",
    type: "Action Plan",
    dueDate: "2025-07-30",
    status: "Pending",
    link: "/action-plans/1",
  },
  {
    id: "ER-015",
    title: "Provide Sales Process Documentation",
    type: "Evidence Request",
    dueDate: "2025-08-05",
    status: "Pending",
    link: "/evidence-requests/15",
  },
  {
    id: "AR-003",
    title: "Approve Vendor Security Policy",
    type: "Action Plan",
    dueDate: "2025-08-15",
    status: "Overdue",
    link: "/action-plans/3",
  },
]

export function MyActionItemsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Action Items</CardTitle>
        <CardDescription>Tasks and requests requiring your attention.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actionItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>
                  <Link href={item.link} className="hover:underline">
                    {item.title}
                  </Link>
                  <span className="block text-xs text-muted-foreground">{item.type}</span>
                </TableCell>
                <TableCell>{item.dueDate}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "Overdue" ? "destructive" : "default"}>{item.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" asChild>
            <Link href="/action-plans">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
