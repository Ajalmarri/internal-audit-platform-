"use client"

import Link from "next/link"
import { CalendarDays, MoreHorizontal, Edit3, FileText, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import type { DisplayableAssignmentWithKanban, Priority } from "../_types/assignment-kanban-types" // Assuming types are centralized

// Helper function for priority badge styling (can be moved to a utils file)
const getPriorityBadgeVariant = (priority: Priority): "destructive" | "warning" | "default" => {
  switch (priority) {
    case "High":
      return "destructive"
    case "Medium":
      return "warning"
    default:
      return "default"
  }
}

interface AssignmentKanbanCardProps {
  assignment: DisplayableAssignmentWithKanban
}

export function AssignmentKanbanCard({ assignment }: AssignmentKanbanCardProps) {
  return (
    <Card className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-lg transition-shadow duration-150 bg-card">
      <CardHeader className="p-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold leading-tight">
            <Link href={`/assignments/${assignment.id}`} className="hover:underline text-card-foreground">
              {assignment.name}
            </Link>
          </CardTitle>
          <Badge variant={getPriorityBadgeVariant(assignment.priority)} className="ml-2 flex-shrink-0">
            {assignment.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>Due: {format(assignment.dueDate, "PP")}</span>
        </div>
        {assignment.assignees.length > 0 && (
          <div className="flex items-center">
            <span className="mr-2 font-medium text-card-foreground">Assignees:</span>
            <div className="flex -space-x-2 overflow-hidden">
              {assignment.assignees.map((assignee) => (
                <Avatar key={assignee.id} className="h-7 w-7 border-2 border-card">
                  <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                  <AvatarFallback>
                    {assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        )}
        <div className="pt-1">
          <Badge variant="outline">{assignment.status}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Assignment actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/assignments/${assignment.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/assignments/${assignment.id}/edit`} className="flex items-center">
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/assignments/${assignment.id}/documents`} className="flex items-center">
                <FileText className="mr-2 h-4 w-4" /> Manage Documents
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
