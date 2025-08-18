"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Users, AlertTriangle, FileText, CheckCircle, XCircle, PlayCircle, PauseCircle } from "lucide-react"
import type {
  Assignment,
  AuditTask,
  DocumentFile,
  RelatedRiskEntry,
  UserStub,
} from "./_types/assignment-types"

// Remove mock users - we'll fetch real users
const initialMockTasks: AuditTask[] = [
  {
    id: "T01",
    description: "Review financial data sources and system access logs",
    status: "In Progress",
    assigneeId: "1", // Will be updated with real user ID
    dueDate: new Date("2025-08-15T00:00:00.000Z"),
    isExpanded: true,
    subTasks: [
      {
        id: "T01-S01",
        description: "Identify all relevant financial systems",
        status: "Completed",
        assigneeId: "1", // Will be updated with real user ID
        dueDate: new Date("2025-08-01T00:00:00.000Z"),
        isExpanded: true,
      },
      {
        id: "T01-S02",
        description: "Obtain read-only access to identified systems",
        status: "In Progress",
        assigneeId: "2", // Will be updated with real user ID
        dueDate: new Date("2025-08-05T00:00:00.000Z"),
        dependsOn: ["T01-S01"],
        isExpanded: true,
      },
      {
        id: "T01-S03",
        description: "Extract GL data for Q3 period",
        status: "Pending",
        assigneeId: "1", // Will be updated with real user ID
        dueDate: new Date("2025-08-10T00:00:00.000Z"),
        dependsOn: ["T01-S02"],
        isExpanded: true,
      },
    ],
  },
  {
    id: "T02",
    description: "Conduct interviews with department heads",
    status: "Pending",
    assigneeId: "2", // Will be updated with real user ID
    dueDate: new Date("2025-08-20T00:00:00.000Z"),
    isExpanded: true,
  },
  {
    id: "T03",
    description: "Test internal controls for financial reporting accuracy",
    status: "Pending",
    assigneeId: "1", // Will be updated with real user ID
    dueDate: new Date("2025-09-01T00:00:00.000Z"),
    dependsOn: ["T01"], // Depends on the parent task T01 being conceptually "done"
    isExpanded: true,
    subTasks: [
      {
        id: "T03-S01",
        description: "Select sample of transactions for testing",
        status: "Pending",
        assigneeId: "3", // Will be updated with real user ID
        dueDate: new Date("2025-08-25T00:00:00.000Z"),
        isExpanded: true,
      },
    ],
  },
  {
    id: "T04",
    description: "Draft preliminary findings report",
    status: "Pending",
    dueDate: new Date("2025-09-15T00:00:00.000Z"),
    isExpanded: true,
  },
]

const initialMockAssignment: Assignment = {
  id: "ASGN002",
  title: "Q3 Compliance Check for Financial Reporting",
  description:
    "Review and validate compliance of Q3 financial reports against internal policies and external regulations.",
  status: "Fieldwork",
  currentStageIndex: 2,
  stages: ["Planning", "Preparation", "Fieldwork", "Reporting", "Follow-up"],
  requirements: {
    type: "Regulatory Compliance",
    riskLikelihood: "Medium",
    impact: "High",
    inherentRisk: "High",
  },
  teamMembers: [], // Will be populated with real users
  startDate: new Date("2025-07-15T00:00:00.000Z"),
  endDate: new Date("2025-09-30T00:00:00.000Z"),
}

const initialMockRelatedRisks: RelatedRiskEntry[] = [
  {
    risk: {
      id: "RISK002",
      title: "Financial Misstatement from Manual Errors",
      inherentRisk: "High",
      description: "Risk of errors in financial reporting due to reliance on manual data entry.",
    },
    controls: [
      { id: "CTRL001", name: "Automated Reconciliation System", assessment: "Effective", lastAssessed: "2025-06-01" },
      {
        id: "CTRL002",
        name: "Segregation of Duties Policy",
        assessment: "Needs Improvement",
        lastAssessed: "2025-06-05",
      },
    ],
    residualRisk: "Medium",
  },
]

const initialMockDocuments: DocumentFile[] = [
  {
    id: "DOC001",
    name: "Q3_Financial_Statement_Draft.pdf",
    type: "pdf",
    size: "2.5 MB",
    uploadDate: "2025-07-20",
    uploader: "System",
  },
]

export default function AssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>()
  const [assignmentData, setAssignmentData] = useState<Assignment>(initialMockAssignment)
  const [tasks, setTasks] = useState<AuditTask[]>(initialMockTasks)
  const [relatedRisksData, setRelatedRisksData] = useState<RelatedRiskEntry[]>(initialMockRelatedRisks)
  const [documents, setDocuments] = useState<DocumentFile[]>(initialMockDocuments)
  const [availableUsers, setAvailableUsers] = useState<UserStub[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  // Fetch real users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`)
        }
        const data: UserStub[] = await response.json()
        // Add avatar placeholder for each user
        const usersWithAvatars = data.map(user => ({
          ...user,
          avatar: "/placeholder.svg?width=40&height=40"
        }))
        setAvailableUsers(usersWithAvatars)
        
        // Update assignment with real team members
        setAssignmentData(prev => ({
          ...prev,
          teamMembers: usersWithAvatars.slice(0, 3) // Use first 3 users as team members
        }))
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [])

  // Simulate fetching data if params.assignmentId changes
  useEffect(() => {
    console.log("Fetching data for assignment:", params.assignmentId)
    setTasks(initialMockTasks)
    setRelatedRisksData(initialMockRelatedRisks)
    setDocuments(initialMockDocuments)
  }, [params.assignmentId])

  if (!assignmentData) {
    return <div>Loading assignment details...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{assignmentData.title}</h1>
          <p className="text-muted-foreground mt-2">{assignmentData.description}</p>
        </div>
        <Badge variant="outline">{assignmentData.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Assignment tasks and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <p>Loading team members...</p>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => {
                    const assignee = availableUsers.find(u => u.id === task.assigneeId)
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{task.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Assigned to: {assignee?.name || "Unknown"}
                          </p>
                        </div>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Assigned team for this assignment</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <p>Loading team members...</p>
              ) : (
                <div className="space-y-3">
                  {assignmentData.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
