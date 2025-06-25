export type AssignmentStatus =
  | "Planning"
  | "Preparation"
  | "Fieldwork"
  | "Reporting"
  | "Follow-up"
  | "Completed"
  | "Cancelled"
export type RiskRating = "Low" | "Medium" | "High" | "Critical"
export type ControlAssessment = "Effective" | "Needs Improvement" | "Ineffective" | "Not Assessed"

export interface UserStub {
  id: string
  name: string
  avatar?: string
}

export interface AssignmentRequirement {
  type: string
  riskLikelihood: RiskRating | string
  impact: RiskRating | string
  inherentRisk: RiskRating | string
}

export interface AuditTask {
  id: string
  description: string
  status: "Pending" | "In Progress" | "Completed" | "Blocked"
  assigneeId?: string
  dueDate?: Date
  subTasks?: AuditTask[]
  dependsOn?: string[]
  isExpanded?: boolean
}

export interface Assignment {
  id: string
  title: string
  description: string
  status: AssignmentStatus
  currentStageIndex: number
  stages: string[]
  requirements: AssignmentRequirement
  teamMembers: UserStub[]
  startDate: Date
  endDate: Date
  // tasks: AuditTask[]; // Tasks will be managed by FulfilmentTasksCard's state, but initial data comes from here
}

export interface Risk {
  id: string
  title: string
  description: string
  inherentRisk: RiskRating
}

export interface Control {
  id: string
  name: string
  description?: string
  assessment: ControlAssessment
  lastAssessed?: string
}

export interface RelatedRiskEntry {
  risk: Risk
  controls: Control[]
  residualRisk?: RiskRating
}

export interface DocumentFile {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  uploader: string
  url?: string
}

export interface Comment {
  id: string
  user: UserStub
  text: string
  timestamp: Date
}
