import type { FindingSeverity } from "./finding-creation-types" // Assuming this is a self-reference or a mistake, should be fine.

export type { FindingSeverity }

export interface FindingTemplate {
  id: string
  name: string
  description: string
  prefilledObservationTitle?: string
  prefilledDetailedObservation?: string
  prefilledCriteriaExpectation?: string
  prefilledImpactRiskAssociated?: string
  prefilledSeverity?: FindingSeverity
  prefilledRecommendation?: string
  prefilledAffectedBusinessUnit?: string
  prefilledRootCause?: string
}

export interface MockAssignment {
  // This type will be used for the fetched data
  id: string
  name: string
  auditPlanName?: string
  status?: string
  description?: string
  startDate?: string
  endDate?: string
}

// This data is now primarily for the API route, not direct import by the page
export const mockAssignments: MockAssignment[] = [
  { id: "ASGN001", name: "Q2 Financial Controls Audit", auditPlanName: "Annual Financial Audit Plan 2025" },
  {
    id: "ASGN002",
    name: "IT Security Assessment - Network Infrastructure",
    auditPlanName: "Cybersecurity Audit Program",
  },
  {
    id: "ASGN003",
    name: "Vendor Compliance Review - Tier 1 Suppliers",
    auditPlanName: "Third-Party Risk Management Plan",
  },
  { id: "ASGN004", name: "HR Payroll Process Audit", auditPlanName: "Internal Controls Review 2025" },
  { id: "ASGN005", name: "Data Privacy Compliance Check (GDPR)", auditPlanName: "Regulatory Compliance Audit Plan" },
  { id: "ASGN_NONE", name: "N/A - Standalone Finding", auditPlanName: "General" },
]

export interface FindingCreationData {
  templateId?: string
  parentAssignmentId?: string
  observationTitle: string
  detailedObservation: string
  criteriaExpectation: string
  impactRiskAssociated: string
  severity: FindingSeverity
  recommendation: string
  affectedBusinessUnit: string
  rootCause?: string
  attachments: File[]
}

export const mockFindingTemplates: FindingTemplate[] = [
  {
    id: "TPL000",
    name: "Blank Finding (No Template)",
    description: "Start with a completely blank finding form.",
  },
  {
    id: "TPL_FC_DEF",
    name: "Financial Control Deficiency",
    description: "Template for documenting weaknesses in financial controls.",
    prefilledCriteriaExpectation: "As per Financial Policy XYZ, all transactions over $10,000 require dual approval.",
    prefilledSeverity: "Medium",
    prefilledImpactRiskAssociated: "Potential for unauthorized expenditure or misstatement if policy is not followed.",
  },
  {
    id: "TPL_OP_INEFF",
    name: "Operational Inefficiency",
    description: "Template for identifying and reporting operational process gaps.",
    prefilledCriteriaExpectation: "Standard operating procedures for process ABC aim for a cycle time of X hours.",
    prefilledSeverity: "Medium",
    prefilledImpactRiskAssociated:
      "Increased operational costs, delays in service delivery, reduced customer satisfaction.",
  },
  {
    id: "TPL_COMP_BRCH",
    name: "Compliance Breach",
    description: "Template for reporting violations of laws, regulations, or internal policies.",
    prefilledCriteriaExpectation: "Regulation XYZ, Section A, Part B requires data to be encrypted at rest.",
    prefilledSeverity: "High",
    prefilledImpactRiskAssociated: "Potential legal penalties, fines, reputational damage, loss of customer trust.",
  },
]

export const mockBusinessUnits = [
  { id: "BU001", name: "Finance Department" },
  { id: "BU002", name: "IT Department" },
  { id: "BU003", name: "Operations - Plant A" },
  { id: "BU004", name: "Human Resources" },
  { id: "BU005", name: "Sales & Marketing" },
  { id: "BU_NONE", name: "N/A or Cross-Departmental" },
]

export const initialFindingCreationData: FindingCreationData = {
  observationTitle: "",
  detailedObservation: "",
  criteriaExpectation: "",
  impactRiskAssociated: "",
  severity: "Medium",
  recommendation: "",
  affectedBusinessUnit: "",
  rootCause: "",
  attachments: [],
  parentAssignmentId: "",
}
