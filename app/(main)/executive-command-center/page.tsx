import { ComplianceStatusWidget } from "./_components/compliance-status-widget"
import { RiskTrendWidget } from "./_components/risk-trend-widget"
import { AuditPlanPerformanceWidget } from "./_components/audit-plan-performance-widget"
import { ResourceAllocationWidget } from "./_components/resource-allocation-widget"
import { KriWidget } from "./_components/kri-widget"
import { ExecutiveBriefingWidget } from "./_components/executive-briefing-widget" // Import the new widget
import type {
  ComplianceStatusData,
  RiskTrendDataPoint,
  AuditPlanPerformanceData,
  ResourceAllocationDataPoint,
  TopEnterpriseRisk,
  KriData,
  RiskDetail,
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

// Helper to generate detailed mock risk data
const generateRiskDetail = (baseScore: number, riskName: string, month: string): RiskDetail => {
  const score = Math.max(1, Math.min(10, baseScore + (Math.random() - 0.5) * 2))
  const descriptions: { [key: string]: string[] } = {
    cybersecurity: [
      `Minor phishing attempts detected and blocked on ${month}.`,
      `System patch applied for vulnerability CVE-2025-1234 on ${month}.`,
      `Increased brute-force attempts on external services noted on ${month}.`,
    ],
    regulatory: [
      `New data privacy guideline draft released by regulators on ${month}.`,
      `Quarterly compliance report submitted on ${month}.`,
      `Internal review of GDPR policies completed on ${month}.`,
    ],
  }
  const riskId = riskName.split(" ")[0].toLowerCase()
  return {
    score: Number.parseFloat(score.toFixed(1)),
    description:
      descriptions[riskId]?.[Math.floor(Math.random() * 3)] ||
      `Standard monitoring activities for ${riskName} on ${month}.`,
    relatedLinks: [
      { title: `Q2 ${riskName} Report`, url: "#" },
      { title: "Relevant Policy Doc", url: "#" },
    ],
  }
}

const mockRiskTrendData: RiskTrendDataPoint[] = Array.from({ length: 12 }, (_, i) => {
  const monthDate = new Date(2024, 5 + i, 1)
  const month = monthDate.toLocaleString("default", { month: "long", year: "numeric" })
  const year = monthDate.getFullYear()

  const dataPoint: RiskTrendDataPoint = { month, year }
  mockTopRisks.forEach((risk, riskIndex) => {
    const baseScore = 3 + riskIndex + Math.sin(i / 3) * 2
    dataPoint[risk.id] = generateRiskDetail(baseScore, risk.name, month)
  })
  return dataPoint
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

const mockKriData: KriData[] = [
  { id: "it-downtime", name: "IT System Downtime", value: "0.5%", status: "Normal", percentage: 15 },
  { id: "employee-turnover", name: "Employee Turnover Rate", value: "15%", status: "Elevated", percentage: 50 },
  { id: "vendor-compliance", name: "Vendor Compliance Failures", value: "8%", status: "Critical", percentage: 85 },
  { id: "overdue-training", name: "Overdue Mandatory Training", value: "12%", status: "Elevated", percentage: 60 },
]

export default function ExecutiveCommandCenterPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Executive Command Center</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Add the new widget at the top */}
        <ExecutiveBriefingWidget />

        <ComplianceStatusWidget data={mockComplianceStatus} />
        <RiskTrendWidget data={mockRiskTrendData} topRisks={mockTopRisks} />
        <KriWidget kris={mockKriData} />
        <AuditPlanPerformanceWidget data={mockAuditPlanPerformance} />
        <ResourceAllocationWidget data={mockResourceAllocation} />
      </div>
    </div>
  )
}
