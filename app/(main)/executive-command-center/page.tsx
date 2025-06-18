import { ComplianceStatusWidget } from "./_components/compliance-status-widget"
import { RiskTrendWidget } from "./_components/risk-trend-widget"
import { AuditPlanPerformanceWidget } from "./_components/audit-plan-performance-widget"
import { ResourceAllocationWidget } from "./_components/resource-allocation-widget"
import type {
  ComplianceStatusData,
  RiskTrendDataPoint,
  AuditPlanPerformanceData,
  ResourceAllocationDataPoint,
  TopEnterpriseRisk,
} from "./_types/command-center-types"

// Mock Data
const mockComplianceStatus: ComplianceStatusData = {
  status: "Effective",
  assessmentDate: "June 18, 2025",
  summary: "Internal control environment is assessed as effective.",
}

const mockTopRisks: TopEnterpriseRisk[] = [
  { id: "cybersecurity", name: "Cybersecurity Threats", color: "hsl(var(--chart-1))" },
  { id: "regulatory", name: "Regulatory Changes", color: "hsl(var(--chart-2))" },
  { id: "supplyChain", name: "Supply Chain Disruption", color: "hsl(var(--chart-3))" },
  { id: "talent", name: "Talent Acquisition & Retention", color: "hsl(var(--chart-4))" },
  { id: "economic", name: "Economic Downturn", color: "hsl(var(--chart-5))" },
]

const mockRiskTrendData: RiskTrendDataPoint[] = Array.from({ length: 12 }, (_, i) => {
  const monthDate = new Date(2024, 5 + i, 1) // Start from June 2024
  const month = monthDate.toLocaleString("default", { month: "short" })
  const year = monthDate.getFullYear()
  const baseData: RiskTrendDataPoint = { month, year }
  mockTopRisks.forEach((risk) => {
    baseData[risk.id] = Math.floor(Math.random() * 5) + 1 + i * 0.1 // Random trend
  })
  return baseData
})

const mockAuditPlanPerformance: AuditPlanPerformanceData = {
  overallProgress: 65,
  auditsCompleted: 25,
  totalAudits: 40,
  highRiskFindings: 7,
}

const mockResourceAllocation: ResourceAllocationDataPoint[] = [
  { name: "Financial Audits", value: 40, fill: "hsl(var(--chart-1))" },
  { name: "Operational Audits", value: 30, fill: "hsl(var(--chart-2))" },
  { name: "IT Audits", value: 20, fill: "hsl(var(--chart-3))" },
  { name: "Compliance Audits", value: 10, fill: "hsl(var(--chart-4))" },
]

export default function ExecutiveCommandCenterPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Executive Command Center</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ComplianceStatusWidget data={mockComplianceStatus} />
        <RiskTrendWidget data={mockRiskTrendData} topRisks={mockTopRisks} />
        <AuditPlanPerformanceWidget data={mockAuditPlanPerformance} />
        <ResourceAllocationWidget data={mockResourceAllocation} />
      </div>
    </div>
  )
}
