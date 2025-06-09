"use client" // Not strictly necessary for a .ts file, but good practice if it might be imported by client components

export type FindingSeverity = "Low" | "Medium" | "High" | "Critical"

export type FindingStatus =
  | "Draft"
  | "Pending Verification"
  | "Verified"
  | "Sent to Business Owner" // Business Owner needs to create action plan
  | "Action Plan Submitted" // BO submitted, Auditor needs to review/accept plan
  | "Action Plan Accepted" // Auditor accepted plan, BO starts remediation
  | "In Remediation" // BO working on actions
  | "Remediation Pending Verification" // BO submitted evidence, Auditor verifies remediation
  | "Resolved"
  | "Closed"
  | "Rejected" // Auditor rejected finding or action plan

export type ActionPlanItemStatus = "To Do" | "In Progress" | "Completed" | "Blocked"

export interface ActionPlanItem {
  id: string
  action: string
  responsiblePerson: string // Could be different from overall finding owner
  dueDate: string // ISO Date string
  status: ActionPlanItemStatus
}

export interface ActionPlan {
  overallObjective: string // BO's high-level objective for the plan
  items: ActionPlanItem[]
  submittedDate: string // ISO Date string
  // Status of the overall action plan might be derived or a specific field
  // For simplicity, we'll tie it to FindingStatus like "Action Plan Submitted", "Action Plan Accepted"
  dueDateExtensionsCount: number
  lastDueDate?: string // To track the most current due date after extensions
}

export interface RemediationEvidence {
  id: string
  description: string
  actionPlanItemId?: string // Link evidence to a specific action item
  attachmentName?: string
  attachmentUrl?: string
  uploadedDate: string
  uploadedBy: string
}

export interface Finding {
  id: string
  assignmentId?: string
  templateId?: string
  title: string
  description: string
  criteria: string
  condition: string
  cause: string
  effect: string
  recommendation: string
  severity: FindingSeverity
  status: FindingStatus
  associatedRisks: string
  responsibleBusinessOwner: string // Primary owner for the finding
  dateCreated: string
  lastUpdated: string

  // Business Owner Response
  isFindingAcceptedByBO?: boolean // Explicit acceptance by Business Owner
  managementComments?: string

  // Auditor Verification of Finding
  verifiedByAuditor?: { name: string; date: string }
  sentToBusinessOwnerDate?: string

  // Action Plan
  actionPlan?: ActionPlan

  // Auditor Review of Action Plan
  isActionPlanApprovedByAuditor?: boolean
  actionPlanApprovalDate?: string
  auditorCommentsOnActionPlan?: string

  // Remediation
  remediationEvidence?: RemediationEvidence[]
  remediationVerifiedByAuditor?: { name: string; date: string }
  closedDate?: string
}

// Mock Data for demonstration
export const mockFindings: Finding[] = [
  {
    id: "FND001",
    assignmentId: "AS001",
    title: "Unsecured S3 Bucket Exposing Sensitive Data",
    description:
      "An S3 bucket (bucket-name-xyz) was found to have public read access, potentially exposing customer PII.",
    criteria:
      "Company policy and data security best practices require all S3 buckets containing sensitive data to have restricted access.",
    condition: "The S3 bucket 'bucket-name-xyz' is configured with public read permissions.",
    cause: "Misconfiguration during deployment of a new service.",
    effect:
      "Potential data breach, non-compliance with data privacy regulations (e.g., GDPR, CCPA), reputational damage, and financial penalties.",
    recommendation:
      "Immediately restrict public access to the S3 bucket. Review and update S3 bucket ACLs and policies. Implement automated checks for S3 bucket configurations.",
    severity: "Critical",
    status: "Sent to Business Owner", // Updated for this scenario
    associatedRisks: "RISK001 (Data Breach), RISK003 (Regulatory Non-Compliance)",
    responsibleBusinessOwner: "IT Security Manager",
    dateCreated: "2025-06-01T10:00:00Z",
    lastUpdated: "2025-06-03T10:00:00Z",
    verifiedByAuditor: { name: "Jane Smith (Auditor)", date: "2025-06-02T11:00:00Z" },
    sentToBusinessOwnerDate: "2025-06-02T12:00:00Z",
  },
  {
    id: "FND002",
    assignmentId: "AS002",
    title: "Lack of Segregation of Duties in Financial Reporting",
    description:
      "The same individual is responsible for preparing, reviewing, and approving certain financial reports, increasing the risk of undetected errors or fraud.",
    criteria:
      "Internal control frameworks (e.g., COSO) and financial best practices mandate appropriate segregation of duties.",
    condition:
      "User 'john.doe@example.com' has roles allowing preparation, review, and approval of quarterly financial summaries.",
    cause: "Insufficient role definition and access control review process.",
    effect: "Increased risk of financial misstatement, potential for fraudulent activities to go unnoticed.",
    recommendation:
      "Review and revise user roles and permissions in the financial system. Implement a process where report preparation, review, and approval are performed by different individuals. Conduct periodic access reviews.",
    severity: "High",
    status: "Action Plan Submitted", // Updated for this scenario
    associatedRisks: "RISK002 (Financial Misstatement)",
    responsibleBusinessOwner: "Finance Department Head",
    dateCreated: "2025-05-15T14:30:00Z",
    lastUpdated: "2025-06-04T09:00:00Z",
    verifiedByAuditor: { name: "Jane Smith (Auditor)", date: "2025-05-20T11:00:00Z" },
    sentToBusinessOwnerDate: "2025-05-20T12:00:00Z",
    isFindingAcceptedByBO: true,
    managementComments:
      "We acknowledge this finding and are committed to addressing it. The proposed action plan outlines our strategy.",
    actionPlan: {
      overallObjective: "Implement proper segregation of duties for financial reporting by Q4 2025.",
      items: [
        {
          id: "AP002-1",
          action: "Review all financial system roles and permissions.",
          responsiblePerson: "Finance Systems Admin",
          dueDate: "2025-07-15T17:00:00Z",
          status: "To Do",
        },
        {
          id: "AP002-2",
          action: "Redefine roles to ensure SoD.",
          responsiblePerson: "Finance Controller",
          dueDate: "2025-08-15T17:00:00Z",
          status: "To Do",
        },
        {
          id: "AP002-3",
          action: "Update SOPs and train relevant staff.",
          responsiblePerson: "Finance Training Lead",
          dueDate: "2025-09-15T17:00:00Z",
          status: "To Do",
        },
      ],
      submittedDate: "2025-06-04T09:00:00Z",
      dueDateExtensionsCount: 0,
      lastDueDate: "2025-09-15T17:00:00Z", // Assuming last item's due date is overall plan due date for now
    },
  },
  // Add more mock findings to test other statuses like "Action Plan Accepted", "In Remediation"
  {
    id: "FND003",
    assignmentId: "AS001",
    title: "Outdated Anti-Virus Signatures on Critical Servers",
    description: "Several critical servers were found to have anti-virus signatures older than 30 days.",
    criteria: "IT Security policy requires daily updates of anti-virus signatures on all servers.",
    condition: "Servers SRV01, SRV05, DB02 have AV signatures last updated on 2025-04-10.",
    cause: "Automated update mechanism failed and was not detected by monitoring.",
    effect: "Increased vulnerability to malware and ransomware attacks.",
    recommendation:
      "Fix the automated update mechanism. Manually update AV signatures on affected servers immediately. Improve monitoring for AV update failures.",
    severity: "Medium",
    status: "Action Plan Accepted",
    associatedRisks: "RISK007 (Unauthorized Access to Systems)",
    responsibleBusinessOwner: "IT Operations Lead",
    dateCreated: "2025-05-10T09:00:00Z",
    lastUpdated: "2025-06-05T16:00:00Z",
    verifiedByAuditor: { name: "Jane Smith (Auditor)", date: "2025-05-12T10:00:00Z" },
    sentToBusinessOwnerDate: "2025-05-12T11:00:00Z",
    isFindingAcceptedByBO: true,
    managementComments: "Acknowledged. Action plan submitted and approved.",
    actionPlan: {
      overallObjective: "Ensure all critical servers have up-to-date AV signatures and robust monitoring.",
      items: [
        {
          id: "AP003-1",
          action: "Manually update AV on SRV01, SRV05, DB02.",
          responsiblePerson: "SysAdmin Team",
          dueDate: "2025-06-10T17:00:00Z",
          status: "Completed",
        },
        {
          id: "AP003-2",
          action: "Investigate and fix automated AV update script.",
          responsiblePerson: "DevOps Team",
          dueDate: "2025-06-15T17:00:00Z",
          status: "In Progress",
        },
        {
          id: "AP003-3",
          action: "Implement enhanced monitoring for AV update failures.",
          responsiblePerson: "Monitoring Team",
          dueDate: "2025-06-20T17:00:00Z",
          status: "To Do",
        },
      ],
      submittedDate: "2025-06-02T15:00:00Z",
      dueDateExtensionsCount: 1, // Example of one extension
      lastDueDate: "2025-06-27T17:00:00Z", // Original was 06-20, extended by 7 days
      isActionPlanApprovedByAuditor: true,
      actionPlanApprovalDate: "2025-06-05T16:00:00Z",
      auditorCommentsOnActionPlan: "Action plan looks reasonable. Please ensure timely completion of item AP003-2.",
    },
  },
]
