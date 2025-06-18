export type RiskLevel = "High" | "Medium" | "Low"

export interface AuditRecord {
  id: string
  title: string
  status: "Planned" | "In Progress" | "Completed" | "Cancelled"
  period: string // e.g., "Q1 2025"
  reportLink?: string // Link to the audit report
}

export interface AuditableEntity {
  id: string
  name: string
  description?: string
  riskLevel: RiskLevel
  lastAuditDate?: string // e.g., "2025-03-15"
  nextAuditDate?: string // e.g., "2026-03-15"
  value: number // For Treemap sizing, could be budget, risk score, etc.
  children?: AuditableEntity[] // For hierarchical data
  audits: AuditRecord[]
  owner?: string
  department?: string
}

// Recharts Treemap expects children to be of the same type
export interface TreemapNode extends AuditableEntity {
  children?: TreemapNode[]
}
