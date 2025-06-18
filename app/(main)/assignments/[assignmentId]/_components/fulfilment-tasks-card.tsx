import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { AuditTask } from "../_types/assignment-types"

interface FulfilmentTasksCardProps {
  tasks: AuditTask[]
}

const taskStatusColors: Record<AuditTask["status"], string> = {
  Pending: "bg-gray-200 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Blocked: "bg-red-100 text-red-700",
}

export default function FulfilmentTasksCard({ tasks }: FulfilmentTasksCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Fulfilment / Tasks</CardTitle>
          <CardDescription>Track and manage assignment tasks.</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Checkbox id={`task-${task.id}`} checked={task.status === "Completed"} />
                <Label htmlFor={`task-${task.id}`} className="flex-grow cursor-pointer">
                  {task.description}
                  {task.assignee && <span className="text-xs text-muted-foreground ml-2">({task.assignee})</span>}
                </Label>
              </div>
              <Badge variant="outline" className={`text-xs ${taskStatusColors[task.status]}`}>
                {task.status}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks added yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
