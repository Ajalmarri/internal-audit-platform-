export type RiskLevel = "High" | "Medium" | "Low"

export interface AuditRecord {
  id: string
  name: string
  status: "Past" | "Present" | "Planned"
  date: string
  auditor: string
}

export interface AuditableEntity {
  id: string
  name: string
  description: string
  riskLevel: RiskLevel
  lastAudit: string
  nextAudit: string
  relatedAudits: AuditRecord[]
  category: "Business Unit" | "Department" | "Key Process"
  position: { x: number; y: number } // Ensure this is present and used
  parentId?: string // Optional: for hierarchical relationships
}
