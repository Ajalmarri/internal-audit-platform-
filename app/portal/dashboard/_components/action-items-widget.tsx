import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const actionItems = [
  { id: 1, title: "Review Q2 Financial Report", due: "3 days", href: "#" },
  { id: 2, title: "Approve new vendor contract", due: "5 days", href: "#" },
  { id: 3, title: "Submit compliance documentation", due: "1 week", href: "#" },
  { id: 4, title: "Complete mandatory security training", due: "2 weeks", href: "#" },
]

export function ActionItemsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Action Items</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {actionItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">Due in {item.due}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
