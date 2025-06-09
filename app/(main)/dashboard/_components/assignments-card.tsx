"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ListChecks, Clock } from "lucide-react"

const assignments = [
  {
    id: "1",
    title: "Assignment driven project initiation phase review",
    status: "In Progress",
    dueDate: "2025-06-15",
  },
  {
    id: "2",
    title: "Q2 Financial Controls Audit",
    status: "Due Soon",
    dueDate: "2025-06-08",
  },
  {
    id: "3",
    title: "IT Security Compliance Check",
    status: "Completed",
    dueDate: "2025-05-20",
  },
  {
    id: "4",
    title: "Vendor Risk Assessment",
    status: "Pending",
    dueDate: "2025-07-01",
  },
]

const statusColors: { [key: string]: string } = {
  "In Progress": "bg-blue-500 hover:bg-blue-600",
  "Due Soon": "bg-yellow-500 hover:bg-yellow-600 text-black",
  Completed: "bg-green-500 hover:bg-green-600",
  Pending: "bg-gray-500 hover:bg-gray-600",
}

export default function AssignmentsCard() {
  const totalAssignments = 123
  const dueSoonAssignments = 50

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">Assignments</CardTitle>
          <CardDescription>Overview of your current tasks.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/assignments">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalAssignments}</p>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-3">
            <Clock className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold">{dueSoonAssignments}</p>
              <p className="text-sm text-muted-foreground">Due Soon</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-md font-medium text-muted-foreground mb-1">Recent Assignments:</h3>
          {assignments.slice(0, 3).map(
            (
              assignment, // Show first 3
            ) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/40 transition-colors"
              >
                <div>
                  <p className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                </div>
                <Badge className={`${statusColors[assignment.status] || "bg-gray-500"} text-white text-xs`}>
                  {assignment.status}
                </Badge>
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}
