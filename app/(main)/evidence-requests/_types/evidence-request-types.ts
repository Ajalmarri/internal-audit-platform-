export interface BusinessOwner {
  id: string
  name: string
  email: string
  department?: string
}

export interface MinimalAssignmentInfo {
  id: string
  title: string
}

export type EvidenceRequestPriority = "High" | "Medium" | "Low"

export interface EvidenceRequestFormData {
  recipientId?: string
  linkedAssignmentId?: string
  subject: string
  description: string
  dueDate?: Date
  priority: EvidenceRequestPriority
}
