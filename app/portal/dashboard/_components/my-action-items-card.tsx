import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const actionItems = [
  { id: 1, title: "Review Q2 Financial Report", due: "3 days" },
  { id: 2, title: "Approve new vendor contract", due: "5 days" },
  { id: 3, title: "Submit compliance documentation", due: "1 week" },
]

export function MyActionItemsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Action Items</CardTitle>
        <CardDescription>Tasks and approvals requiring your attention.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {actionItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">Due in {item.due}</p>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
