"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Briefcase, Calendar, User, FileText, AlertTriangle, Edit } from "lucide-react"

// Mock data types for an assignment within an engagement
interface AssignmentTask {
  id: string
  description: string
  status: "Pending" | "In Progress" | "Completed"
  assignee?: string
}

interface AssignmentDocument {
  id: string
  name: string
  type: "PDF" | "Word" | "Spreadsheet"
  url: string
}

interface AssignmentComment {
  id: string
  user: string
  text: string
  timestamp: string
}

interface EngagementAssignmentDetail {
  id: string // Assignment ID
  engagementId: string
  title: string
  description: string
  status: "Planning" | "Fieldwork" | "Review" | "Completed"
  dueDate: string
  assignedTo: string[]
  tasks: AssignmentTask[]
  documents: AssignmentDocument[]
  comments: AssignmentComment[]
}

// Extended mock data for assignments, including the ones linked from ENG-001
const mockAssignmentsData: EngagementAssignmentDetail[] = [
  {
    id: "ASGN-001",
    engagementId: "ENG-001",
    title: "Risk Assessment & Scoping",
    description: "Conduct initial risk assessment and define the scope for the IT security audit.",
    status: "Completed",
    dueDate: "2025-02-15",
    assignedTo: ["Yara Al-Jamil", "Omar Kattan"],
    tasks: [
      { id: "T001", description: "Identify key IT assets", status: "Completed", assignee: "Yara Al-Jamil" },
      { id: "T002", description: "Review existing security policies", status: "Completed", assignee: "Omar Kattan" },
      { id: "T003", description: "Finalize audit scope document", status: "Completed", assignee: "Yara Al-Jamil" },
    ],
    documents: [{ id: "DOC001", name: "Audit Scope v1.0.pdf", type: "PDF", url: "#" }],
    comments: [
      { id: "C001", user: "Yara Al-Jamil", text: "Scope document approved by stakeholder.", timestamp: "2025-02-14" },
    ],
  },
  {
    id: "ASGN-002",
    engagementId: "ENG-001",
    title: "Control Testing - Network",
    description: "Test network security controls, including firewalls, IDS/IPS, and VPN configurations.",
    status: "In Progress",
    dueDate: "2025-03-10",
    assignedTo: ["Aliya Hassan"],
    tasks: [
      { id: "T004", description: "Firewall rule review", status: "In Progress", assignee: "Aliya Hassan" },
      { id: "T005", description: "IDS/IPS effectiveness testing", status: "Pending" },
    ],
    documents: [],
    comments: [],
  },
  {
    id: "ASGN-003",
    engagementId: "ENG-001",
    title: "Control Testing - Data Security",
    description: "Assess data security measures, including encryption, access controls, and data loss prevention.",
    status: "Pending",
    dueDate: "2025-03-25",
    assignedTo: ["Samir Qureshi"],
    tasks: [],
    documents: [],
    comments: [],
  },
  {
    id: "ASGN-004",
    engagementId: "ENG-001",
    title: "Reporting & Documentation",
    description: "Compile audit findings, prepare the draft report, and finalize documentation.",
    status: "Pending",
    dueDate: "2025-04-15",
    assignedTo: ["Yara Al-Jamil"],
    tasks: [],
    documents: [],
    comments: [],
  },
]

export default function EngagementAssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const engagementId = params.engagementId as string
  const assignmentId = params.assignmentId as string

  const [assignment, setAssignment] = useState<EngagementAssignmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (engagementId && assignmentId) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const foundAssignment = mockAssignmentsData.find(
          (a) => a.id === assignmentId && a.engagementId === engagementId,
        )
        setAssignment(foundAssignment || null)
        setIsLoading(false)
      }, 500)
    }
  }, [engagementId, assignmentId])

  if (isLoading) {
    // This will be handled by loading.tsx, but good to have a fallback
    return <div className="p-6">Loading assignment details...</div>
  }

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Assignment Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find an assignment with ID: <strong>{assignmentId}</strong> for engagement{" "}
          <strong>{engagementId}</strong>.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  const getStatusBadgeVariant = (status: EngagementAssignmentDetail["status"]) => {
    switch (status) {
      case "Completed":
        return "success"
      case "In Progress":
        return "default"
      case "Fieldwork":
        return "default"
      case "Review":
        return "secondary"
      case "Planning":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Engagement</span>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{assignment.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusBadgeVariant(assignment.status)}>{assignment.status}</Badge>
              <span className="text-sm text-muted-foreground">Engagement ID: {engagementId}</span>
            </div>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" /> Edit Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{assignment.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks ({assignment.tasks.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignment.tasks.length > 0 ? (
                assignment.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{task.description}</p>
                      {task.assignee && <p className="text-xs text-muted-foreground">Assignee: {task.assignee}</p>}
                    </div>
                    <Badge
                      variant={
                        task.status === "Completed" ? "success" : task.status === "In Progress" ? "default" : "outline"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tasks for this assignment.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents ({assignment.documents.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignment.documents.length > 0 ? (
                assignment.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">Type: {doc.type}</p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No documents attached.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments ({assignment.comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignment.comments.length > 0 ? (
                assignment.comments.map((comment) => (
                  <div key={comment.id} className="p-3 border rounded-md bg-muted/20">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{comment.user}</p>
                      <p className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
              {/* Add comment form could go here */}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Status:</span>
                <Badge variant={getStatusBadgeVariant(assignment.status)} className="ml-auto">
                  {assignment.status}
                </Badge>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Due Date:</span>
                <span className="ml-auto text-muted-foreground">
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-start">
                <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="font-medium">Assigned To:</span>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {assignment.assignedTo.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
