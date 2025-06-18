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
  riskLikelihood: RiskRating | string // Allow string for flexibility
  impact: RiskRating | string
  inherentRisk: RiskRating | string
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
}

export interface AuditTask {
  id: string
  description: string
  status: "Pending" | "In Progress" | "Completed" | "Blocked"
  assignee?: string // Name or ID
  dueDate?: Date
}

export interface Risk {
  id: string
  title: string
  description: string
  inherentRisk: RiskRating
  // other risk properties
}

export interface Control {
  id: string
  name: string
  description?: string
  assessment: ControlAssessment
  lastAssessed?: string // Date string
}

export interface RelatedRiskEntry {
  risk: Risk
  controls: Control[]
  residualRisk?: RiskRating // Calculated or manually set
}

export interface DocumentFile {
  id: string
  name: string
  type: string // e.g., 'pdf', 'docx'
  size: string // e.g., '2.5 MB'
  uploadDate: string // Date string
  uploader: string // User name or ID
  url?: string // For download
}

export interface Comment {
  id: string
  user: UserStub
  text: string
  timestamp: Date
}
