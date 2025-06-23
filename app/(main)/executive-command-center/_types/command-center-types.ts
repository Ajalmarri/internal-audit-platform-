export interface ComplianceStatusData {
  status: "Effective" | "Needs Improvement" | "Ineffective"
  assessmentDate: string
  summary: string
}

// New interface for detailed risk data at a specific point in time
export interface RiskDetail {
  score: number
  description: string
  relatedLinks: { title: string; url: string }[]
}

export interface RiskTrendDataPoint {
  month: string // e.g., "January 2024"
  year: number
  // Each risk ID will now map to a RiskDetail object
  cybersecurity?: RiskDetail
  regulatory?: RiskDetail
  supplyChain?: RiskDetail
  talent?: RiskDetail
  economic?: RiskDetail
  // Allow other string keys for flexibility
  [key: string]: RiskDetail | number | string | undefined
}

export interface TopEnterpriseRisk {
  id: "cybersecurity" | "regulatory" | "supplyChain" | "talent" | "economic"
  name: string
  color: string // For chart line
}

export interface AuditPlanPerformanceData {
  overallProgress: number // Percentage
  auditsCompleted: number
  totalAudits: number
  highRiskFindings: number
}

export interface ResourceAllocationDataPoint {
  name: string // e.g., "Financial Audits"
  value: number // Percentage or FTE count
  fill: string // Color for the chart segment
}

export type KriStatus = "Normal" | "Elevated" | "Critical"

export interface KriData {
  id: string
  name: string
  value: string
  status: KriStatus
  percentage: number // 0-100, for gauge positioning
  description?: string // Optional description for the KRI
}
