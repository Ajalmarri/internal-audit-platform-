export type FindingSeverity = "Low" | "Medium" | "High" | "Critical"

export interface FindingTemplate {
  id: string
  name: string
  description: string
  // Fields that can be pre-filled by the template
  prefilledObservationTitle?: string
  prefilledDetailedObservation?: string
  prefilledCriteriaExpectation?: string
  prefilledImpactRiskAssociated?: string
  prefilledSeverity?: FindingSeverity
  prefilledRecommendation?: string
  prefilledAffectedBusinessUnit?: string
  prefilledRootCause?: string
}

export interface FindingCreationData {
  templateId?: string
  observationTitle: string
  detailedObservation: string
  criteriaExpectation: string
  impactRiskAssociated: string
  severity: FindingSeverity
  recommendation: string
  affectedBusinessUnit?: string
  rootCause?: string
  attachments: File[]
}

// Mock Data
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
}
