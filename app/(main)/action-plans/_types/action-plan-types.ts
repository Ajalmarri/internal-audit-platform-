// Create a new types file for action plans for better organization
export interface ActionPlanItem {
  id: string
  action: string
  responsiblePerson: string
  dueDate: string // ISO Date string
  status: "To Do" | "In Progress" | "Completed" | "Blocked"
}

export type ActionPlanStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Overdue"
  | "At Risk"
  | "Submitted for Review"
  | "Changes Requested"

export interface ActionPlan {
  id: string
  findingId: string
  findingTitle: string
  businessOwner: string
  auditorInCharge?: string // New field
  overallObjective: string
  items: ActionPlanItem[]
  submittedDate: string
  lastUpdated: string
  progress: number // 0-100
  status: ActionPlanStatus
  reviewFeedback?: string // To store feedback
}
