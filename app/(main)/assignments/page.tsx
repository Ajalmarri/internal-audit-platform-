"use client"

import Link from "next/link"
import { PlusCircle, MoreHorizontal, CalendarDays, UserCircle, List, LayoutGrid } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import React from "react"

// Import Kanban specific components and types
import { AssignmentKanbanBoard } from "./_components/assignment-kanban-board"
import type {
  DisplayableAssignment,
  AssignmentDisplayStatus,
  DisplayableAssignmentWithKanban,
  Priority,
  KanbanWorkflowStatus,
} from "./_types/assignment-kanban-types"

// Mock Data - Ensure this uses DisplayableAssignmentWithKanban
const baseMockAssignments: DisplayableAssignment[] = [
  {
    id: "AP001-AS001",
    name: "Project Initiation Phase Review",
    status: "In Progress", // Will be mapped to Fieldwork
    dueDate: new Date("2025-09-15"),
    assignees: [{ id: "U001", name: "Alice Wonderland", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AP001-AS002",
    name: "Q2 Financial Controls Audit",
    status: "Planning",
    dueDate: new Date("2025-07-30"),
    assignees: [{ id: "U002", name: "Bob The Builder", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AP002-AS003",
    name: "IT Security Assessment",
    status: "Completed",
    dueDate: new Date("2025-05-20"),
    assignees: [{ id: "U003", name: "Charlie Brown", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AP002-AS004",
    name: "Vendor Risk Management Review",
    status: "Reporting", // Will be mapped to In Review
    dueDate: new Date("2025-08-30"),
    assignees: [
      { id: "U001", name: "Alice Wonderland", avatar: "/placeholder.svg?width=32&height=32" },
      { id: "U004", name: "Diana Prince", avatar: "/placeholder.svg?width=32&height=32" },
    ],
  },
  {
    id: "AP003-AS005",
    name: "Compliance Audit - GDPR",
    status: "Fieldwork",
    dueDate: new Date("2025-10-01"),
    assignees: [{ id: "U002", name: "Bob The Builder", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AP003-AS006",
    name: "Internal Process Optimization",
    status: "Planning",
    dueDate: new Date("2025-11-15"),
    assignees: [{ id: "U005", name: "Edward Scissorhands", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AP004-AS007",
    name: "Q3 Operational Efficiency Analysis",
    status: "In Review", // Directly map if possible, or from 'Reporting'
    dueDate: new Date("2025-10-10"),
    assignees: [{ id: "U003", name: "Charlie Brown", avatar: "/placeholder.svg?width=32&height=32" }],
  },
]

const mockAssignmentsWithKanban: DisplayableAssignmentWithKanban[] = baseMockAssignments
  .map((assignment, index) => {
    const priorities: Priority[] = ["High", "Medium", "Low"]
    let calculatedKanbanStatus: KanbanWorkflowStatus

    switch (assignment.status) {
      case "Planning":
        calculatedKanbanStatus = "Planning"
        break
      case "In Progress":
      case "Fieldwork":
        calculatedKanbanStatus = "Fieldwork"
        break
      case "Reporting": // Assuming 'Reporting' maps to 'In Review' for Kanban
      case "In Review": // If status can already be 'In Review'
        calculatedKanbanStatus = "In Review"
        break
      case "Completed":
        calculatedKanbanStatus = "Completed"
        break
      // For statuses like 'Due Soon', 'Overdue', 'Cancelled', 'Follow-up'
      // they don't directly map to the active workflow columns specified.
      // They might be filtered out or handled differently if they were to appear on this specific board.
      // For this example, we'll assume our baseMockAssignments primarily use statuses that map.
      // If an assignment's status doesn't map, it won't appear on this board.
      default:
        // This case should ideally not be hit if data is clean or filtered beforehand for the Kanban view
        // For safety, assign to a default or handle as an error/log
        calculatedKanbanStatus = "Planning" // Fallback, or filter these out
        break
    }

    // Filter out assignments that don't map to a Kanban column
    const validKanbanStatuses: KanbanWorkflowStatus[] = ["Planning", "Fieldwork", "In Review", "Completed"]
    if (!validKanbanStatuses.includes(calculatedKanbanStatus)) {
      return null // This will be filtered out later
    }

    return {
      ...assignment,
      priority: priorities[index % priorities.length],
      kanbanStatus: calculatedKanbanStatus,
    }
  })
  .filter(Boolean) as DisplayableAssignmentWithKanban[] // Filter out nulls and assert type

// Helper for table status badges
const getTableStatusBadgeVariant = (
  status: AssignmentDisplayStatus,
): "default" | "secondary" | "destructive" | "outline" | "warning" | "success" => {
  switch (status) {
    case "Completed":
      return "success"
    case "In Progress":
    case "Fieldwork":
    case "Reporting":
    case "Follow-up":
    case "In Review":
      return "default"
    case "Planning":
      return "secondary"
    case "Due Soon":
      return "warning"
    case "Overdue":
      return "destructive"
    case "Cancelled":
      return "outline"
    default:
      return "default"
  }
}

export default function AssignmentsPage() {
  const [selectedAssignments, setSelectedAssignments] = React.useState<Set<string>>(new Set())
  const [isHeaderChecked, setIsHeaderChecked] = React.useState<boolean | "indeterminate">(false)
  const [activeView, setActiveView] = React.useState<"list" | "board">("list")

  const handleHeaderCheckboxChange = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedAssignments(new Set(mockAssignmentsWithKanban.map((a) => a.id)))
      setIsHeaderChecked(true)
    } else {
      setSelectedAssignments(new Set())
      setIsHeaderChecked(false)
    }
  }

  const handleRowCheckboxChange = (assignmentId: string, checked: boolean | "indeterminate") => {
    const newSelectedAssignments = new Set(selectedAssignments)
    if (checked === true) {
      newSelectedAssignments.add(assignmentId)
    } else {
      newSelectedAssignments.delete(assignmentId)
    }
    setSelectedAssignments(newSelectedAssignments)
    setIsHeaderChecked(
      newSelectedAssignments.size === mockAssignmentsWithKanban.length && mockAssignmentsWithKanban.length > 0
        ? true
        : newSelectedAssignments.size > 0
          ? "indeterminate"
          : false,
    )
  }

  // Ensure mock data is available
  if (!mockAssignmentsWithKanban) {
    return <div>Loading assignments data...</div> // Or a proper loading skeleton
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
              variant={activeView === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("list")}
              aria-pressed={activeView === "list"}
            >
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button
              variant={activeView === "board" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("board")}
              aria-pressed={activeView === "board"}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Board
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          {" "}
          {/* Allow content to grow and scroll if needed */}
          {activeView === "list" ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={isHeaderChecked}
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
                  {mockAssignmentsWithKanban.map((assignment) => (
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
              {mockAssignmentsWithKanban.length === 0 && activeView === "list" && (
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
