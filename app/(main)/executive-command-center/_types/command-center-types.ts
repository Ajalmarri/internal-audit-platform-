export interface ComplianceStatusData {
  status: "Effective" | "Needs Improvement" | "Ineffective"
  assessmentDate: string
  summary: string
}

export interface RiskTrendDataPoint {
  month: string // e.g., "Jan", "Feb"
  year: number
  // Each key represents a risk, value is its score/level
  [riskName: string]: number | string
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

export interface TopEnterpriseRisk {
  id: string
  name: string
  color: string // For chart line
}
