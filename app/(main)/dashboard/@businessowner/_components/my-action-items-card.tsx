"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

const actionItems = [
  {
    id: 1,
    title: "Review Q2 Financial Report",
    description: "Annual financial audit findings require management response",
    dueDate: "2024-01-25",
    priority: "high" as const,
    status: "pending" as const,
  },
  {
    id: 2,
    title: "Approve New Vendor Contract",
    description: "IT procurement audit recommendation implementation",
    dueDate: "2024-01-28",
    priority: "medium" as const,
    status: "pending" as const,
  },
  {
    id: 3,
    title: "Update Risk Assessment",
    description: "Quarterly risk assessment update for Finance department",
    dueDate: "2024-01-30",
    priority: "medium" as const,
    status: "in_progress" as const,
  },
  {
    id: 4,
    title: "Staff Training Completion",
    description: "Ensure all team members complete compliance training",
    dueDate: "2024-02-05",
    priority: "low" as const,
    status: "pending" as const,
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-orange-500" />
    case "in_progress":
      return <AlertTriangle className="h-4 w-4 text-blue-500" />
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "Overdue"
  if (diffDays === 0) return "Due today"
  if (diffDays === 1) return "Due tomorrow"
  return `Due in ${diffDays} days`
}

export function MyActionItemsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          My Action Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <h4 className="font-medium">{item.title}</h4>
                  <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">{getDaysUntilDue(item.dueDate)}</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            View All Action Items
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
