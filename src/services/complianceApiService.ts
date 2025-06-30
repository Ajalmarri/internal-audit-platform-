import { externalApiService } from "./externalApiService"
import { logger } from "../utils/logger"
import { AppError } from "../utils/errors"

interface ComplianceFramework {
  id: string
  name: string
  version: string
  description: string
  requirements: ComplianceRequirement[]
}

interface ComplianceRequirement {
  id: string
  title: string
  description: string
  category: string
  severity: "low" | "medium" | "high" | "critical"
  controls: string[]
}

interface ComplianceAssessment {
  frameworkId: string
  organizationId: string
  status: "compliant" | "non-compliant" | "partially-compliant"
  score: number
  findings: ComplianceFinding[]
  lastAssessed: string
}

interface ComplianceFinding {
  requirementId: string
  status: "pass" | "fail" | "not-applicable"
  evidence?: string
  notes?: string
}

export class ComplianceApiService {
  // Get available compliance frameworks
  async getComplianceFrameworks(): Promise<ComplianceFramework[]> {
    try {
      const response = await externalApiService.get<ComplianceFramework[]>("/compliance/frameworks")

      if (!response.success) {
        throw new AppError(`Failed to fetch compliance frameworks: ${response.error}`, 500)
      }

      return response.data || []
    } catch (error) {
      logger.error("Error fetching compliance frameworks:", error)
      throw new AppError("Unable to retrieve compliance frameworks", 500)
    }
  }

  // Get specific compliance framework
  async getComplianceFramework(frameworkId: string): Promise<ComplianceFramework | null> {
    try {
      const response = await externalApiService.get<ComplianceFramework>(`/compliance/frameworks/${frameworkId}`)

      if (!response.success) {
        if (response.error?.includes("404")) {
          return null
        }
        throw new AppError(`Failed to fetch compliance framework: ${response.error}`, 500)
      }

      return response.data || null
    } catch (error) {
      logger.error(`Error fetching compliance framework ${frameworkId}:`, error)
      throw new AppError("Unable to retrieve compliance framework", 500)
    }
  }

  // Submit compliance assessment
  async submitComplianceAssessment(assessment: Partial<ComplianceAssessment>): Promise<ComplianceAssessment> {
    try {
      const response = await externalApiService.post<ComplianceAssessment>("/compliance/assessments", assessment)

      if (!response.success) {
        throw new AppError(`Failed to submit compliance assessment: ${response.error}`, 500)
      }

      if (!response.data) {
        throw new AppError("No data returned from compliance assessment submission", 500)
      }

      return response.data
    } catch (error) {
      logger.error("Error submitting compliance assessment:", error)
      throw new AppError("Unable to submit compliance assessment", 500)
    }
  }

  // Get compliance assessment results
  async getComplianceAssessment(organizationId: string, frameworkId: string): Promise<ComplianceAssessment | null> {
    try {
      const response = await externalApiService.get<ComplianceAssessment>(
        `/compliance/assessments/${organizationId}/${frameworkId}`,
      )

      if (!response.success) {
        if (response.error?.includes("404")) {
          return null
        }
        throw new AppError(`Failed to fetch compliance assessment: ${response.error}`, 500)
      }

      return response.data || null
    } catch (error) {
      logger.error("Error fetching compliance assessment:", error)
      throw new AppError("Unable to retrieve compliance assessment", 500)
    }
  }

  // Validate compliance data
  async validateComplianceData(data: any): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const response = await externalApiService.post<{ valid: boolean; errors: string[] }>("/compliance/validate", data)

      if (!response.success) {
        throw new AppError(`Failed to validate compliance data: ${response.error}`, 500)
      }

      return response.data || { valid: false, errors: ["Unknown validation error"] }
    } catch (error) {
      logger.error("Error validating compliance data:", error)
      throw new AppError("Unable to validate compliance data", 500)
    }
  }
}

export const complianceApiService = new ComplianceApiService()
