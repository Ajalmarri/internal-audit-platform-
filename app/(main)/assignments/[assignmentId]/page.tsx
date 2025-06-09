// This is a dynamic route, e.g., /assignments/AS001
// For this example, we'll mock data as if assignmentId is passed
// In a real app, you'd fetch data based on params.assignmentId

import AssignmentHeader from "./_components/assignment-header"
import ProcessTracker from "./_components/process-tracker"
import RequirementDetailsCard from "./_components/requirement-details-card"
import FulfilmentTasksCard from "./_components/fulfilment-tasks-card"
import RelatedRisksCard from "./_components/related-risks-card"
import DocumentManagementCard from "./_components/document-management-card"
import CommentsSection from "./_components/comments-section"
import AssignedTeamCard from "./_components/assigned-team-card"
import type { Assignment, AuditTask, Comment, DocumentFile, RelatedRiskEntry } from "./_types/assignment-types"

// Mock Data
const mockAssignment: Assignment = {
  id: "AS001",
  title: "Q3 Compliance Check for Financial Reporting",
  description:
    "Review and validate compliance of Q3 financial reports against internal policies and external regulations.",
  status: "Fieldwork",
  currentStageIndex: 2, // 'Fieldwork'
  stages: ["Planning", "Preparation", "Fieldwork", "Reporting", "Follow-up"],
  requirements: {
    type: "Regulatory Compliance",
    riskLikelihood: "Medium",
    impact: "High",
    inherentRisk: "High",
  },
  teamMembers: [
    { id: "USR001", name: "Aisha Al-Farsi", avatar: "/placeholder.svg?width=40&height=40" },
    { id: "USR002", name: "Omar Hassan", avatar: "/placeholder.svg?width=40&height=40" },
  ],
  startDate: new Date("2024-07-15"),
  endDate: new Date("2024-09-30"),
}

const mockTasks: AuditTask[] = [
  { id: "T01", description: "Review financial data sources", status: "Completed", assignee: "Aisha Al-Farsi" },
  {
    id: "T02",
    description: "Conduct interviews with department heads",
    status: "In Progress",
    assignee: "Omar Hassan",
  },
  { id: "T03", description: "Test internal controls for reporting", status: "Pending", assignee: "Aisha Al-Farsi" },
  { id: "T04", description: "Draft preliminary findings report", status: "Pending" },
]

const mockRelatedRisks: RelatedRiskEntry[] = [
  {
    risk: {
      id: "RISK002",
      title: "Financial Misstatement from Manual Errors",
      inherentRisk: "High",
      description: "Risk of errors in financial reporting due to reliance on manual data entry.",
    },
    controls: [
      { id: "CTRL001", name: "Automated Reconciliation System", assessment: "Effective", lastAssessed: "2024-06-01" },
      {
        id: "CTRL002",
        name: "Segregation of Duties Policy",
        assessment: "Needs Improvement",
        lastAssessed: "2024-06-05",
      },
    ],
    residualRisk: "Medium",
  },
  {
    risk: {
      id: "RISK007",
      title: "Unauthorized Access to Financial Systems",
      inherentRisk: "Medium",
      description: "Potential for unauthorized users to access and modify financial data.",
    },
    controls: [
      { id: "CTRL003", name: "MFA for Financial Systems", assessment: "Effective", lastAssessed: "2024-05-20" },
    ],
    residualRisk: "Low",
  },
]

const mockDocuments: DocumentFile[] = [
  {
    id: "DOC001",
    name: "Q3_Financial_Statement_Draft.pdf",
    type: "pdf",
    size: "2.5 MB",
    uploadDate: "2024-07-20",
    uploader: "System",
  },
  {
    id: "DOC002",
    name: "Interview_Notes_DeptHeads.docx",
    type: "docx",
    size: "120 KB",
    uploadDate: "2024-07-25",
    uploader: "Omar Hassan",
  },
]

const mockComments: Comment[] = [
  {
    id: "CMT001",
    user: { id: "USR001", name: "Aisha Al-Farsi", avatar: "/placeholder.svg?width=40&height=40" },
    text: "Initial review of data sources complete. Found some discrepancies in system X.",
    timestamp: new Date("2024-07-22T10:30:00Z"),
  },
  {
    id: "CMT002",
    user: { id: "USR003", name: "Ali (Business Owner)", avatar: "/placeholder.svg?width=40&height=40" },
    text: "Thanks for the update, Aisha. Can you provide more details on the discrepancies found in System X?",
    timestamp: new Date("2024-07-22T14:00:00Z"),
  },
]

export default function AssignmentDetailPage({ params }: { params: { assignmentId: string } }) {
  // In a real app, fetch assignmentData based on params.assignmentId
  const assignmentData = mockAssignment
  const tasks = mockTasks
  const relatedRisksData = mockRelatedRisks
  const documents = mockDocuments
  const comments = mockComments

  return (
    <div className="flex flex-col gap-6">
      <AssignmentHeader title={assignmentData.title} status={assignmentData.status} />
      <ProcessTracker stages={assignmentData.stages} currentStageIndex={assignmentData.currentStageIndex} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Column (2/3 width on lg) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FulfilmentTasksCard tasks={tasks} />
          <RelatedRisksCard initialRisks={relatedRisksData} />
          <DocumentManagementCard initialDocuments={documents} />
          <CommentsSection initialComments={comments} />
        </div>

        {/* Sidebar Column (1/3 width on lg) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <RequirementDetailsCard requirements={assignmentData.requirements} />
          <AssignedTeamCard teamMembers={assignmentData.teamMembers} />
          {/* Potentially other summary cards or actions here */}
        </div>
      </div>
    </div>
  )
}
