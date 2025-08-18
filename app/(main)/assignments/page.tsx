"use client"

import Link from "next/link"
import { PlusCircle, MoreHorizontal, CalendarDays, UserCircle, List, LayoutGrid, Loader2 } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import React, { useState, useEffect } from "react"

// Import Kanban specific components and types
import { AssignmentKanbanBoard } from "./_components/assignment-kanban-board"
import type {
  DisplayableAssignment,
  AssignmentDisplayStatus,
  DisplayableAssignmentWithKanban,
  Priority,
  KanbanWorkflowStatus,
} from "./_types/assignment-kanban-types"

// Interface for database assignment
interface AssignmentFromDB {
  id: string
  title: string
  description?: string
  status?: string
  audit_plan_id?: string
  created_at?: string
  updated_at?: string
}

// Convert database assignment to displayable assignment
const convertToDisplayableAssignment = (dbAssignment: AssignmentFromDB): DisplayableAssignment => {
  return {
    id: dbAssignment.id,
    name: dbAssignment.title,
    status: (dbAssignment.status as AssignmentDisplayStatus) || "Planning",
    dueDate: new Date(dbAssignment.end_date || dbAssignment.created_at || Date.now()),
    assignees: [],
  }
}

const getTableStatusBadgeVariant = (
  status: AssignmentDisplayStatus,
): "default" | "secondary" | "destructive" | "outline" => {
      switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
      case "Fieldwork":
        return "default"
      case "Planning":
        return "secondary"
      case "In Review":
      case "Reporting":
        return "outline"
      case "Not Started":
        return "outline"
      default:
        return "outline"
    }
}

export default function AssignmentsPage() {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
  const [selectedAssignments, setSelectedAssignments] = useState<Set<string>>(new Set())
  const [assignments, setAssignments] = useState<DisplayableAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/assignments')
        if (!response.ok) {
          throw new Error('Failed to fetch assignments')
        }
        const data: AssignmentFromDB[] = await response.json()
        const displayableAssignments = data.map(convertToDisplayableAssignment)
        setAssignments(displayableAssignments)
      } catch (error) {
        console.error('Error fetching assignments:', error)
        // Fallback to empty array if API fails
        setAssignments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const handleHeaderCheckboxChange = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedAssignments(new Set(assignments.map((a) => a.id)))
    } else {
      setSelectedAssignments(new Set())
    }
  }

  const handleRowCheckboxChange = (assignmentId: string, checked: boolean | "indeterminate") => {
    const newSelected = new Set(selectedAssignments)
    if (checked) {
      newSelected.add(assignmentId)
    } else {
      newSelected.delete(assignmentId)
    }
    setSelectedAssignments(newSelected)
  }

  const mockAssignmentsWithKanban: DisplayableAssignmentWithKanban[] = assignments
    .map((assignment, index) => {
      let calculatedKanbanStatus: KanbanWorkflowStatus

      switch (assignment.status) {
        case "Planning":
          calculatedKanbanStatus = "Planning"
          break
        case "In Progress":
        case "Fieldwork":
          calculatedKanbanStatus = "Fieldwork"
          break
        case "Reporting":
        case "In Review":
          calculatedKanbanStatus = "In Review"
          break
        case "Completed":
          calculatedKanbanStatus = "Completed"
          break
        default:
          calculatedKanbanStatus = "Planning"
      }

      return {
        ...assignment,
        kanbanStatus: calculatedKanbanStatus,
        priority: ["High", "Medium", "Low"][index % 3] as Priority,
      }
    })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Assignments</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading assignments...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Assignments</h1>
        <Link href="/assignments/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Assignment
          </Button>
        </Link>
      </div>

      <Card className="flex-grow flex flex-col">
        {" "}
        {/* Allow card to grow and be a flex container */}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Assignments</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              aria-pressed={viewMode === "table"}
            >
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              aria-pressed={viewMode === "kanban"}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Board
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          {" "}
          {/* Allow content to grow and scroll if needed */}
          {viewMode === "table" ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedAssignments.size === assignments.length && assignments.length > 0}
                        onCheckedChange={handleHeaderCheckboxChange}
                        aria-label="Select all assignments"
                      />
                    </TableHead>
                    <TableHead>Assignment Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assignee(s)</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedAssignments.has(assignment.id)}
                          onCheckedChange={(checked) => handleRowCheckboxChange(assignment.id, checked)}
                          aria-label={`Select assignment ${assignment.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{assignment.name}</TableCell>
                      <TableCell>
                        <Badge variant={getTableStatusBadgeVariant(assignment.status)}>{assignment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {format(assignment.dueDate, "PP")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2 overflow-hidden">
                          {assignment.assignees.map((assignee) => (
                            <Avatar key={assignee.id} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                              <AvatarFallback>
                                {assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {assignment.assignees.length === 0 && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <UserCircle className="h-4 w-4" />
                              <span>Unassigned</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Assignment actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/assignments/${assignment.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/assignments/${assignment.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/assignments/${assignment.id}/documents`}>Manage Documents</Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {assignments.length === 0 && viewMode === "table" && (
                <div className="text-center py-8 text-muted-foreground">No assignments found.</div>
              )}
            </>
          ) : (
            <AssignmentKanbanBoard assignments={mockAssignmentsWithKanban} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
