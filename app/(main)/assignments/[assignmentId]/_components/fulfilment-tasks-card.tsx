"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCheck, Circle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface FulfilmentTask {
  id: string
  title: string
  status: "complete" | "incomplete" | "in_progress"
}

const mockTasks: FulfilmentTask[] = [
  {
    id: "assignment-1",
    title: "Initial Setup and Configuration",
    status: "complete",
  },
  {
    id: "assignment-2",
    title: "Data Migration and Integration",
    status: "in_progress",
  },
  {
    id: "assignment-3",
    title: "User Training and Onboarding",
    status: "incomplete",
  },
]

interface FulfilmentTasksCardProps {
  assignmentId: string
}

const FulfilmentTasksCard = ({ assignmentId }: FulfilmentTasksCardProps) => {
  const [tasks, setTasks] = useState<FulfilmentTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching tasks based on assignmentId
    // In a real application, you would fetch this data from an API
    setTimeout(() => {
      // Filter tasks based on assignmentId (mock implementation)
      const filteredTasks = mockTasks.filter((task) => task.id.includes("assignment"))
      setTasks(filteredTasks)
      setLoading(false)
    }, 500)
  }, [assignmentId])

  const getStatusBadge = (status: FulfilmentTask["status"]) => {
    switch (status) {
      case "complete":
        return (
          <Badge variant="outline">
            <CheckCheck className="mr-2 h-4 w-4" />
            Complete
          </Badge>
        )
      case "incomplete":
        return (
          <Badge variant="destructive">
            <Circle className="mr-2 h-4 w-4" />
            Incomplete
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            In Progress
          </Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fulfilment Tasks</CardTitle>
          <CardDescription>Loading tasks...</CardDescription>
        </CardHeader>
        <CardContent>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fulfilment Tasks</CardTitle>
        <CardDescription>Tasks required to fulfil this assignment.</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div>No tasks found for this assignment.</div>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="py-2">
                {task.title} - {getStatusBadge(task.status)}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default FulfilmentTasksCard
