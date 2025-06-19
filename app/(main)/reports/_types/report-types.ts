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

// In GeneratedReport interface, update status type
export type ReportStatus = "Draft" | "Awaiting Approval" | "Finalized" | "Archived"

export interface GeneratedReport {
  id: string
  title: string
  templateId: string
  generatedDate: string // ISO Date
  status: ReportStatus // Updated type
  version: string
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
  { id: "BO001", name: "Finance Department Head", type: "BusinessOwner", email: "finance.head@example.com" },
  { id: "BO002", name: "IT Security Manager", type: "BusinessOwner", email: "it.security@example.com" },
  { id: "BO003", name: "Operations Lead", type: "BusinessOwner", email: "ops.lead@example.com" },
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

// Update mockGeneratedReports with new statuses
export const mockGeneratedReports: GeneratedReport[] = [
  {
    id: "REP001",
    title: "Q3 Financial Audit Full Report",
    templateId: "TPL_FULL_AUDIT",
    generatedDate: "2025-06-02T10:00:00Z",
    status: "Finalized",
    version: "v1.1",
    filePath: "/reports/REP001_Q3_Financial_Audit.pdf",
    recipients: [mockBusinessOwnersForReport[0]],
    includedFindingIds: ["FND001", "FND002"],
    dateRange: { from: "2025-04-01T00:00:00Z", to: "2025-06-01T00:00:00Z" },
  },
  {
    id: "REP002",
    title: "IT Security Report - For IT Manager",
    templateId: "TPL_BO_SPECIFIC",
    generatedDate: "2025-06-03T14:30:00Z",
    status: "Awaiting Approval", // New status
    version: "v1.0",
    filePath: "/reports/REP002_IT_Security_Report_IT_Manager.pdf",
    recipients: [mockBusinessOwnersForReport[1]],
    includedFindingIds: ["FND001", "FND003"],
    targetBusinessOwnerId: "BO002",
  },
  {
    id: "REP003",
    title: "Executive Summary - May Audits",
    templateId: "TPL_EXECUTIVE_SUMMARY",
    generatedDate: "2025-06-01T09:00:00Z",
    status: "Draft",
    version: "v0.8 (Draft)",
    recipients: [],
    includedFindingIds: ["FND002", "FND003"],
  },
  {
    id: "REP004",
    title: "Annual Compliance Review",
    templateId: "TPL_FULL_AUDIT",
    generatedDate: "2025-05-15T11:00:00Z",
    status: "Finalized",
    version: "v2.0",
    filePath: "/reports/REP004_Annual_Compliance_Review.pdf",
    recipients: [mockBusinessOwnersForReport[0], mockBusinessOwnersForReport[2]],
    includedFindingIds: ["FND004", "FND005"],
  },
  {
    id: "REP005",
    title: "Q2 Operational Audit",
    templateId: "TPL_FULL_AUDIT",
    generatedDate: "2025-06-10T09:00:00Z",
    status: "Awaiting Approval", // New status
    version: "v1.0",
    filePath: "/reports/REP005_Q2_Operational_Audit.pdf",
    recipients: [mockBusinessOwnersForReport[2]],
    includedFindingIds: ["FND006", "FND007"],
  },
]

// Types for Sharing
export type ReportPermission = "view" | "comment"

export interface PlatformUserOrGroup {
  id: string
  name: string
  type: "User" | "Group"
  email?: string // Optional, might be relevant for users
}

export interface SelectedRecipient extends PlatformUserOrGroup {
  permission: ReportPermission
}

export interface ShareDetailsPayload {
  reportId: string
  recipients: SelectedRecipient[]
  message?: string
}

// Mock users and groups for sharing recipient selection
export const mockUsersAndGroupsForSharing: PlatformUserOrGroup[] = [
  { id: "USR001", name: "Alice Wonderland", type: "User", email: "alice@example.com" },
  { id: "USR002", name: "Bob The Builder", type: "User", email: "bob@example.com" },
  { id: "GRP001", name: "Finance Committee", type: "Group" },
  { id: "GRP002", name: "Steering Group", type: "Group" },
  { id: "USR003", name: "Charlie Brown", type: "User", email: "charlie@example.com" },
  { id: "BO001", name: "Finance Department Head", type: "User", email: "finance.head@example.com" }, // Re-using from business owners
  { id: "BO002", name: "IT Security Manager", type: "User", email: "it.security@example.com" },
]
