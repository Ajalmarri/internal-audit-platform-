import type { FindingStatus, FindingSeverity } from "../../findings/_types/finding-types"

export interface ReportTemplate {
  id: string
  name: string
  description: string
  defaultSections?: string[] // e.g., ["introduction", "scope", "findingsSummary"]
}

export interface ReportRecipient {
  id: string // User or Group ID
  name: string
  type: "User" | "Group" | "BusinessOwner"
  email?: string // For notification or direct sharing
}

export interface GeneratedReport {
  id: string
  title: string
  templateId: string
  generatedDate: string // ISO Date
  status: "Draft" | "Finalized" | "Archived"
  filePath?: string // URL to the generated report file (e.g., PDF)
  recipients: ReportRecipient[] // For access control
  includedFindingIds: string[]
  dateRange?: { from: string; to: string }
  targetBusinessOwnerId?: string
  // other metadata
}

// Simplified Finding structure for report generation context
export interface FindingSummaryForReport {
  id: string
  title: string
  status: FindingStatus
  severity: FindingSeverity
  responsibleBusinessOwner: string // Name or ID
  responsibleBusinessOwnerId?: string // ID for filtering
  // Add other relevant fields like dateCreated, resolutionDate etc.
}

// Mock Business Owners for selection
export const mockBusinessOwnersForReport: ReportRecipient[] = [
  { id: "BO001", name: "Finance Department Head", type: "BusinessOwner" },
  { id: "BO002", name: "IT Security Manager", type: "BusinessOwner" },
  { id: "BO003", name: "Operations Lead", type: "BusinessOwner" },
  { id: "BO004", name: "All Departments (Summary)", type: "Group" }, // Example for a general report
]

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: "TPL_FULL_AUDIT",
    name: "Full Audit Report",
    description: "Comprehensive report including all details, findings, and management responses.",
  },
  {
    id: "TPL_EXECUTIVE_SUMMARY",
    name: "Executive Summary Report",
    description: "High-level overview of the audit, key findings, and overall assessment.",
  },
  {
    id: "TPL_BO_SPECIFIC",
    name: "Business Owner Specific Report",
    description: "Report tailored to a specific business owner, focusing on relevant findings.",
  },
  {
    id: "TPL_FINDINGS_LIST",
    name: "Detailed Findings List",
    description: "A report that primarily lists findings with their details.",
  },
]

// Add mock generated reports if not already present or expand it
export const mockGeneratedReports: GeneratedReport[] = [
  {
    id: "REP001",
    title: "Q3 Financial Audit Full Report",
    templateId: "TPL_FULL_AUDIT",
    generatedDate: "2025-06-02T10:00:00Z",
    status: "Finalized",
    filePath: "/reports/REP001_Q3_Financial_Audit.pdf", // Example path
    recipients: [mockBusinessOwnersForReport[0]],
    includedFindingIds: ["FND001", "FND002"],
    dateRange: { from: "2025-04-01T00:00:00Z", to: "2025-06-01T00:00:00Z" },
  },
  {
    id: "REP002",
    title: "IT Security Report - For IT Manager",
    templateId: "TPL_BO_SPECIFIC",
    generatedDate: "2025-06-03T14:30:00Z",
    status: "Finalized",
    filePath: "/reports/REP002_IT_Security_Report_IT_Manager.pdf",
    recipients: [mockBusinessOwnersForReport[1]],
    includedFindingIds: ["FND001", "FND003"], // Assuming FND003 is IT related
    targetBusinessOwnerId: "BO002",
  },
  {
    id: "REP003",
    title: "Executive Summary - May Audits",
    templateId: "TPL_EXECUTIVE_SUMMARY",
    generatedDate: "2025-06-01T09:00:00Z",
    status: "Draft",
    recipients: [],
    includedFindingIds: ["FND002", "FND003"],
  },
]
