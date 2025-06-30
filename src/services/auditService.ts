import { executeQuery, executeTransaction } from "../config/database"
import type {
  AuditPlan,
  CreateAuditPlanRequest,
  UpdateAuditPlanRequest,
  AuditFinding,
  CreateFindingRequest,
} from "../types/audit"
import { AppError } from "../utils/errors"
import { logger } from "../utils/logger"
import { AuditLogService } from "./auditLogService"

export class AuditService {
  private auditLogService = new AuditLogService()

  async findAuditPlanById(id: number): Promise<AuditPlan | null> {
    try {
      const plans = await executeQuery<AuditPlan>(
        `SELECT id, title, description, status, priority, start_date as startDate, end_date as endDate, 
         budget, actual_cost as actualCost, created_by as createdBy, assigned_to as assignedTo, 
         department, risk_level as riskLevel, compliance_framework as complianceFramework,
         created_at as createdAt, updated_at as updatedAt 
         FROM audit_plans WHERE id = ?`,
        [id],
      )

      return plans[0] || null
    } catch (error) {
      logger.error("Error finding audit plan by ID:", error)
      throw new AppError("Failed to find audit plan", 500)
    }
  }

  async findAllAuditPlans(page = 1, limit = 10, filters?: any): Promise<{ plans: AuditPlan[]; total: number }> {
    try {
      const offset = (page - 1) * limit
      let whereClause = "WHERE 1=1"
      const params: any[] = []

      if (filters?.status) {
        whereClause += " AND status = ?"
        params.push(filters.status)
      }

      if (filters?.priority) {
        whereClause += " AND priority = ?"
        params.push(filters.priority)
      }

      if (filters?.assignedTo) {
        whereClause += " AND assigned_to = ?"
        params.push(filters.assignedTo)
      }

      if (filters?.department) {
        whereClause += " AND department = ?"
        params.push(filters.department)
      }

      if (filters?.search) {
        whereClause += " AND (title LIKE ? OR description LIKE ?)"
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm)
      }

      const plans = await executeQuery<AuditPlan>(
        `SELECT id, title, description, status, priority, start_date as startDate, end_date as endDate, 
         budget, actual_cost as actualCost, created_by as createdBy, assigned_to as assignedTo, 
         department, risk_level as riskLevel, compliance_framework as complianceFramework,
         created_at as createdAt, updated_at as updatedAt 
         FROM audit_plans ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      )

      const totalResult = await executeQuery<{ count: number }>(
        `SELECT COUNT(*) as count FROM audit_plans ${whereClause}`,
        params,
      )

      return {
        plans,
        total: totalResult[0].count,
      }
    } catch (error) {
      logger.error("Error finding audit plans:", error)
      throw new AppError("Failed to retrieve audit plans", 500)
    }
  }

  async createAuditPlan(planData: CreateAuditPlanRequest, createdBy: number): Promise<AuditPlan> {
    try {
      const result = await executeTransaction(async (connection) => {
        const [insertResult] = await connection.execute(
          `INSERT INTO audit_plans (title, description, priority, start_date, end_date, budget, 
           assigned_to, department, risk_level, compliance_framework, created_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            planData.title,
            planData.description,
            planData.priority,
            planData.startDate,
            planData.endDate,
            planData.budget,
            planData.assignedTo,
            planData.department,
            planData.riskLevel,
            planData.complianceFramework,
            createdBy,
          ],
        )

        const planId = (insertResult as any).insertId

        // Log the creation
        await this.auditLogService.log({
          userId: createdBy,
          action: "CREATE_AUDIT_PLAN",
          resourceType: "audit_plan",
          resourceId: planId,
          newValues: planData,
        })

        return planId
      })

      const newPlan = await this.findAuditPlanById(result)
      if (!newPlan) {
        throw new AppError("Failed to create audit plan", 500)
      }

      return newPlan
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error("Error creating audit plan:", error)
      throw new AppError("Failed to create audit plan", 500)
    }
  }

  async updateAuditPlan(id: number, planData: UpdateAuditPlanRequest, updatedBy: number): Promise<AuditPlan> {
    try {
      const existingPlan = await this.findAuditPlanById(id)
      if (!existingPlan) {
        throw new AppError("Audit plan not found", 404)
      }

      await executeTransaction(async (connection) => {
        const updateFields: string[] = []
        const params: any[] = []

        Object.entries(planData).forEach(([key, value]) => {
          if (value !== undefined) {
            const dbField =
              key === "startDate"
                ? "start_date"
                : key === "endDate"
                  ? "end_date"
                  : key === "actualCost"
                    ? "actual_cost"
                    : key === "assignedTo"
                      ? "assigned_to"
                      : key === "riskLevel"
                        ? "risk_level"
                        : key === "complianceFramework"
                          ? "compliance_framework"
                          : key.replace(/([A-Z])/g, "_$1").toLowerCase()

            updateFields.push(`${dbField} = ?`)
            params.push(value)
          }
        })

        if (updateFields.length === 0) {
          return
        }

        updateFields.push("updated_at = CURRENT_TIMESTAMP")
        params.push(id)

        await connection.execute(`UPDATE audit_plans SET ${updateFields.join(", ")} WHERE id = ?`, params)

        // Log the update
        await this.auditLogService.log({
          userId: updatedBy,
          action: "UPDATE_AUDIT_PLAN",
          resourceType: "audit_plan",
          resourceId: id,
          oldValues: existingPlan,
          newValues: planData,
        })
      })

      const updatedPlan = await this.findAuditPlanById(id)
      if (!updatedPlan) {
        throw new AppError("Failed to update audit plan", 500)
      }

      return updatedPlan
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error("Error updating audit plan:", error)
      throw new AppError("Failed to update audit plan", 500)
    }
  }

  async deleteAuditPlan(id: number, deletedBy: number): Promise<void> {
    try {
      const existingPlan = await this.findAuditPlanById(id)
      if (!existingPlan) {
        throw new AppError("Audit plan not found", 404)
      }

      await executeTransaction(async (connection) => {
        await connection.execute("DELETE FROM audit_plans WHERE id = ?", [id])

        // Log the deletion
        await this.auditLogService.log({
          userId: deletedBy,
          action: "DELETE_AUDIT_PLAN",
          resourceType: "audit_plan",
          resourceId: id,
          oldValues: existingPlan,
        })
      })
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error("Error deleting audit plan:", error)
      throw new AppError("Failed to delete audit plan", 500)
    }
  }

  async findFindingsByAuditPlan(auditPlanId: number): Promise<AuditFinding[]> {
    try {
      const findings = await executeQuery<AuditFinding>(
        `SELECT id, audit_plan_id as auditPlanId, title, description, severity, status, category,
         recommendation, management_response as managementResponse, due_date as dueDate, 
         resolved_date as resolvedDate, created_by as createdBy, assigned_to as assignedTo,
         created_at as createdAt, updated_at as updatedAt 
         FROM audit_findings WHERE audit_plan_id = ? 
         ORDER BY severity DESC, created_at DESC`,
        [auditPlanId],
      )

      return findings
    } catch (error) {
      logger.error("Error finding audit findings:", error)
      throw new AppError("Failed to retrieve audit findings", 500)
    }
  }

  async createFinding(findingData: CreateFindingRequest, createdBy: number): Promise<AuditFinding> {
    try {
      const result = await executeTransaction(async (connection) => {
        const [insertResult] = await connection.execute(
          `INSERT INTO audit_findings (audit_plan_id, title, description, severity, category, 
           recommendation, due_date, assigned_to, created_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            findingData.auditPlanId,
            findingData.title,
            findingData.description,
            findingData.severity,
            findingData.category,
            findingData.recommendation,
            findingData.dueDate,
            findingData.assignedTo,
            createdBy,
          ],
        )

        const findingId = (insertResult as any).insertId

        // Log the creation
        await this.auditLogService.log({
          userId: createdBy,
          action: "CREATE_FINDING",
          resourceType: "audit_finding",
          resourceId: findingId,
          newValues: findingData,
        })

        return findingId
      })

      const findings = await executeQuery<AuditFinding>(
        `SELECT id, audit_plan_id as auditPlanId, title, description, severity, status, category,
         recommendation, management_response as managementResponse, due_date as dueDate, 
         resolved_date as resolvedDate, created_by as createdBy, assigned_to as assignedTo,
         created_at as createdAt, updated_at as updatedAt 
         FROM audit_findings WHERE id = ?`,
        [result],
      )

      return findings[0]
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error("Error creating audit finding:", error)
      throw new AppError("Failed to create audit finding", 500)
    }
  }
}
