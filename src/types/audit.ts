export interface AuditPlan {
  id: number
  title: string
  description?: string
  status: AuditStatus
  priority: Priority
  startDate: Date
  endDate: Date
  budget?: number
  actualCost: number
  createdBy: number
  assignedTo?: number
  department?: string
  riskLevel: RiskLevel
  complianceFramework?: string
  createdAt: Date
  updatedAt: Date
}

export type AuditStatus = "draft" | "approved" | "in_progress" | "completed" | "cancelled"
export type Priority = "low" | "medium" | "high" | "critical"
export type RiskLevel = "low" | "medium" | "high"

export interface CreateAuditPlanRequest {
  title: string
  description?: string
  priority: Priority
  startDate: string
  endDate: string
  budget?: number
  assignedTo?: number
  department?: string
  riskLevel: RiskLevel
  complianceFramework?: string
}

export interface UpdateAuditPlanRequest {
  title?: string
  description?: string
  status?: AuditStatus
  priority?: Priority
  startDate?: string
  endDate?: string
  budget?: number
  actualCost?: number
  assignedTo?: number
  department?: string
  riskLevel?: RiskLevel
  complianceFramework?: string
}

export interface AuditFinding {
  id: number
  auditPlanId: number
  title: string
  description: string
  severity: Severity
  status: FindingStatus
  category?: string
  recommendation?: string
  managementResponse?: string
  dueDate?: Date
  resolvedDate?: Date
  createdBy: number
  assignedTo?: number
  createdAt: Date
  updatedAt: Date
}

export type Severity = "low" | "medium" | "high" | "critical"
export type FindingStatus = "open" | "in_progress" | "resolved" | "closed"

export interface CreateFindingRequest {
  auditPlanId: number
  title: string
  description: string
  severity: Severity
  category?: string
  recommendation?: string
  dueDate?: string
  assignedTo?: number
}
