import { externalApiService } from "./externalApiService"
import { logger } from "../utils/logger"
import { AppError } from "../utils/errors"

interface RiskAssessment {
  id: string
  organizationId: string
  assessmentType: "operational" | "financial" | "compliance" | "strategic"
  riskFactors: RiskFactor[]
  overallScore: number
  riskLevel: "low" | "medium" | "high" | "critical"
  recommendations: string[]
  createdAt: string
  updatedAt: string
}

interface RiskFactor {
  category: string
  description: string
  likelihood: number // 1-5 scale
  impact: number // 1-5 scale
  riskScore: number
  mitigationStrategies: string[]
}

interface RiskMatrix {
  categories: string[]
  factors: RiskFactor[]
  thresholds: {
    low: number
    medium: number
    high: number
    critical: number
  }
}

export class RiskApiService {
  // Get risk assessment matrix/framework
  async getRiskMatrix(): Promise<RiskMatrix> {
    try {
      const response = await externalApiService.get<RiskMatrix>("/risk/matrix")

      if (!response.success) {
        throw new AppError(`Failed to fetch risk matrix: ${response.error}`, 500)
      }

      if (!response.data) {
        throw new AppError("No risk matrix data returned", 500)
      }

      return response.data
    } catch (error) {
      logger.error("Error fetching risk matrix:", error)
      throw new AppError("Unable to retrieve risk assessment matrix", 500)
    }
  }

  // Perform automated risk assessment
  async performRiskAssessment(organizationData: any): Promise<RiskAssessment> {
    try {
      const response = await externalApiService.post<RiskAssessment>("/risk/assess", organizationData, {
        timeout: 60000, // Risk assessment might take longer
      })

      if (!response.success) {
        throw new AppError(`Failed to perform risk assessment: ${response.error}`, 500)
      }

      if (!response.data) {
        throw new AppError("No risk assessment data returned", 500)
      }

      return response.data
    } catch (error) {
      logger.error("Error performing risk assessment:", error)
      throw new AppError("Unable to perform risk assessment", 500)
    }
  }

  // Get historical risk assessments
  async getRiskAssessmentHistory(organizationId: string, limit = 10): Promise<RiskAssessment[]> {
    try {
      const response = await externalApiService.get<RiskAssessment[]>("/risk/history", {
        organizationId,
        limit,
      })

      if (!response.success) {
        throw new AppError(`Failed to fetch risk assessment history: ${response.error}`, 500)
      }

      return response.data || []
    } catch (error) {
      logger.error("Error fetching risk assessment history:", error)
      throw new AppError("Unable to retrieve risk assessment history", 500)
    }
  }

  // Get risk recommendations
  async getRiskRecommendations(riskFactors: RiskFactor[]): Promise<string[]> {
    try {
      const response = await externalApiService.post<{ recommendations: string[] }>("/risk/recommendations", {
        riskFactors,
      })

      if (!response.success) {
        throw new AppError(`Failed to get risk recommendations: ${response.error}`, 500)
      }

      return response.data?.recommendations || []
    } catch (error) {
      logger.error("Error getting risk recommendations:", error)
      throw new AppError("Unable to retrieve risk recommendations", 500)
    }
  }
}

export const riskApiService = new RiskApiService()
