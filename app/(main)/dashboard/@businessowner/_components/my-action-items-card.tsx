import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

const actionItems = [
  {
    id: 1,
    title: "Review Q2 Financial Report",
    dueDate: "2024-01-25",
    priority: "high" as const,
    status: "pending" as const,
  },
  {
    id: 2,
    title: "Approve new vendor contract",
    dueDate: "2024-01-27",
    priority: "medium" as const,
    status: "pending" as const,
  },
  {
    id: 3,
    title: "Sign off on compliance training",
    dueDate: "2024-01-30",
    priority: "low" as const,
    status: "pending" as const,
  },
  {
    id: 4,
    title: "Review audit findings response",
    dueDate: "2024-01-22",
    priority: "high" as const,
    status: "overdue" as const,
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "overdue":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

export function MyActionItemsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          My Action Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">Due: {item.dueDate}</p>
                </div>
              </div>
              <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
