import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const actionItems = [
  {
    title: "Review Q2 Financial Report",
    due: "Due in 3 days",
    href: "#",
  },
  {
    title: "Approve new vendor contract",
    due: "Due in 5 days",
    href: "#",
  },
  {
    title: "Submit evidence for compliance check",
    due: "Due in 1 week",
    href: "#",
  },
  {
    title: "Complete mandatory security training",
    due: "Due in 2 weeks",
    href: "#",
  },
]

export function ActionItemsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Action Items</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {actionItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.due}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
