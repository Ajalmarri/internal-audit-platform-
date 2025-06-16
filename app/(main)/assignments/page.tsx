"use client"

import Link from "next/link"
import { PlusCircle, MoreHorizontal, CalendarDays, UserCircle } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import React from "react"

type AssignmentDisplayStatus =
  | "Planning"
  | "In Progress"
  | "Fieldwork"
  | "Reporting"
  | "Follow-up"
  | "Completed"
  | "Cancelled"
  | "Due Soon"
  | "Overdue"

interface Assignee {
  id: string
  name: string
  avatar?: string
}

interface DisplayableAssignment {
  id: string
  name: string
  status: AssignmentDisplayStatus
  dueDate: Date
  assignees: Assignee[]
}

const mockAssignments: DisplayableAssignment[] = [
  {
    id: "AS001",
    name: "Assignment driven project initiation phase review",
    status: "In Progress",
    dueDate: new Date("2025-09-15"),
    assignees: [{ id: "U001", name: "Alice Wonderland", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AS002",
    name: "Q2 Financial Controls Audit",
    status: "Planning",
    dueDate: new Date("2025-07-30"),
    assignees: [{ id: "U002", name: "Bob The Builder", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AS003",
    name: "IT Security Assessment",
    status: "Completed",
    dueDate: new Date("2025-05-20"),
    assignees: [{ id: "U003", name: "Charlie Brown", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AS004",
    name: "Vendor Risk Management Review",
    status: "Due Soon",
    dueDate: new Date("2025-06-30"), // Example: Due soon
    assignees: [
      { id: "U001", name: "Alice Wonderland" },
      { id: "U004", name: "Diana Prince" },
    ],
  },
  {
    id: "AS005",
    name: "Compliance Audit - GDPR",
    status: "Overdue",
    dueDate: new Date("2025-06-01"), // Example: Overdue
    assignees: [{ id: "U002", name: "Bob The Builder" }],
  },
  {
    id: "AS006",
    name: "Internal Process Optimization Review",
    status: "Fieldwork",
    dueDate: new Date("2025-08-25"),
    assignees: [{ id: "U005", name: "Edward Scissorhands", avatar: "/placeholder.svg?width=32&height=32" }],
  },
  {
    id: "AS007",
    name: "Q3 Operational Efficiency Analysis",
    status: "Reporting",
    dueDate: new Date("2025-10-10"),
    assignees: [{ id: "U003", name: "Charlie Brown" }],
  },
]

const getStatusBadgeVariant = (
  status: AssignmentDisplayStatus,
): "default" | "secondary" | "destructive" | "outline" | "warning" | "success" => {
  switch (status) {
    case "Completed":
      return "success"
    case "In Progress":
    case "Fieldwork":
    case "Reporting":
    case "Follow-up":
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
  const [isHeaderChecked, setIsHeaderChecked] = React.useState(false)

  const handleHeaderCheckboxChange = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedAssignments(new Set(mockAssignments.map((a) => a.id)))
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
      newSelectedAssignments.size === mockAssignments.length
        ? true
        : newSelectedAssignments.size > 0
          ? "indeterminate"
          : false,
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Assignments</h1>
          {/* Breadcrumbs would typically be part of a layout component */}
          {/* <p className="text-sm text-muted-foreground">Dashboard / Assignments</p> */}
        </div>
        <Link href="/assignments/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Assignment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          {/* Optional: Add filters or search here */}
        </CardHeader>
        <CardContent>
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
              {mockAssignments.map((assignment) => (
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
                    <Badge variant={getStatusBadgeVariant(assignment.status)}>{assignment.status}</Badge>
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
                          {/* Assuming an edit page like /assignments/[id]/edit */}
                          <Link href={`/assignments/${assignment.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          {/* Assuming a documents page like /assignments/[id]/documents */}
                          <Link href={`/assignments/${assignment.id}/documents`}>Manage Documents</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mockAssignments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No assignments found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
