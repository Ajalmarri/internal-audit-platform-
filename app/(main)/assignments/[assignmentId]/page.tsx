"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import AssignmentHeader from "./_components/assignment-header"
import ProcessTracker from "./_components/process-tracker"
import RequirementDetailsCard from "./_components/requirement-details-card"
import FulfilmentTasksCard from "./_components/fulfilment-tasks-card"
import RelatedRisksCard from "./_components/related-risks-card"
import DocumentManagementCard from "./_components/document-management-card"
import CommentsSection from "./_components/comments-section"
import AssignedTeamCard from "./_components/assigned-team-card"
import DataAnalysisCard from "./_components/data-analysis-card"

import type {
  Assignment,
  AuditTask,
  Comment,
  DocumentFile,
  RelatedRiskEntry,
  UserStub,
} from "./_types/assignment-types"

// Mock Data (Adjusted for enhanced tasks)
const mockUser1: UserStub = { id: "USR001", name: "Aisha Al-Farsi", avatar: "/placeholder.svg?width=40&height=40" }
const mockUser2: UserStub = { id: "USR002", name: "Omar Hassan", avatar: "/placeholder.svg?width=40&height=40" }
const mockUser3: UserStub = { id: "USR003", name: "Layla Ibrahim", avatar: "/placeholder.svg?width=40&height=40" }

const initialMockTasks: AuditTask[] = [
  {
    id: "T01",
    description: "Review financial data sources and system access logs",
    status: "In Progress",
    assigneeId: mockUser1.id,
    dueDate: new Date("2025-08-15T00:00:00.000Z"),
    isExpanded: true,
    subTasks: [
      {
        id: "T01-S01",
        description: "Identify all relevant financial systems",
        status: "Completed",
        assigneeId: mockUser1.id,
        dueDate: new Date("2025-08-01T00:00:00.000Z"),
        isExpanded: true,
      },
      {
        id: "T01-S02",
        description: "Obtain read-only access to identified systems",
        status: "In Progress",
        assigneeId: mockUser2.id,
        dueDate: new Date("2025-08-05T00:00:00.000Z"),
        dependsOn: ["T01-S01"],
        isExpanded: true,
      },
      {
        id: "T01-S03",
        description: "Extract GL data for Q3 period",
        status: "Pending",
        assigneeId: mockUser1.id,
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
    assigneeId: mockUser2.id,
    dueDate: new Date("2025-08-20T00:00:00.000Z"),
    isExpanded: true,
  },
  {
    id: "T03",
    description: "Test internal controls for financial reporting accuracy",
    status: "Pending",
    assigneeId: mockUser1.id,
    dueDate: new Date("2025-09-01T00:00:00.000Z"),
    dependsOn: ["T01"], // Depends on the parent task T01 being conceptually "done"
    isExpanded: true,
    subTasks: [
      {
        id: "T03-S01",
        description: "Select sample of transactions for testing",
        status: "Pending",
        assigneeId: mockUser3.id,
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
  id: "AS001",
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
  teamMembers: [mockUser1, mockUser2, mockUser3],
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

const initialMockComments: Comment[] = [
  {
    id: "CMT001",
    user: mockUser1,
    text: "Initial review of data sources complete. Found some discrepancies in system X.",
    timestamp: new Date("2025-07-22T10:30:00Z"),
  },
]

export default function AssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>()
  // In a real app, fetch assignmentData based on params.assignmentId
  // For now, we use mock data. We'll use state to allow components to modify their parts of the data.
  const [assignmentData, setAssignmentData] = useState<Assignment>(initialMockAssignment)
  const [tasks, setTasks] = useState<AuditTask[]>(initialMockTasks) // FulfilmentTasksCard will manage its own state based on this initial prop
  const [relatedRisksData, setRelatedRisksData] = useState<RelatedRiskEntry[]>(initialMockRelatedRisks)
  const [documents, setDocuments] = useState<DocumentFile[]>(initialMockDocuments)
  const [comments, setComments] = useState<Comment[]>(initialMockComments)

  // Simulate fetching data if params.assignmentId changes (though for mock, it won't change much)
  useEffect(() => {
    // Here you would fetch data based on params.assignmentId
    // For mock purposes, we just re-initialize if needed or could load different mock sets
    console.log("Fetching data for assignment:", params.assignmentId)
    setAssignmentData(initialMockAssignment) // Or load specific mock based on ID
    setTasks(initialMockTasks)
    setRelatedRisksData(initialMockRelatedRisks)
    setDocuments(initialMockDocuments)
    setComments(initialMockComments)
  }, [params.assignmentId])

  if (!assignmentData) {
    // You might want a more sophisticated loading state here
    return <div>Loading assignment details...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <AssignmentHeader title={assignmentData.title} status={assignmentData.status} />
      <ProcessTracker stages={assignmentData.stages} currentStageIndex={assignmentData.currentStageIndex} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Column (2/3 width on lg) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FulfilmentTasksCard
            initialTasks={tasks} // Pass the initial tasks
            teamMembers={assignmentData.teamMembers}
            assignmentId={assignmentData.id}
          />
          <DataAnalysisCard /> {/* Assuming this component exists and is self-contained or uses context/props */}
          <RelatedRisksCard initialRisks={relatedRisksData} />
          <DocumentManagementCard initialDocuments={documents} />
          <CommentsSection initialComments={comments} currentUser={mockUser1} />{" "}
          {/* Pass current user for new comments */}
        </div>

        {/* Sidebar Column (1/3 width on lg) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <RequirementDetailsCard requirements={assignmentData.requirements} />
          <AssignedTeamCard teamMembers={assignmentData.teamMembers} />
        </div>
      </div>
    </div>
  )
}
