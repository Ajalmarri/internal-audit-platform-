import { executeQuery } from "../config/database"
import { logger } from "../utils/logger"

interface AuditLogEntry {
  userId?: number
  action: string
  resourceType: string
  resourceId?: number
  oldValues?: any
  newValues?: any
  ipAddress?: string
  userAgent?: string
}

export class AuditLogService {
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await executeQuery(
        `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.userId,
          entry.action,
          entry.resourceType,
          entry.resourceId,
          entry.oldValues ? JSON.stringify(entry.oldValues) : null,
          entry.newValues ? JSON.stringify(entry.newValues) : null,
          entry.ipAddress,
          entry.userAgent,
        ],
      )
    } catch (error) {
      logger.error("Failed to log audit entry:", error)
      // Don't throw error to avoid breaking the main operation
    }
  }

  async findLogs(filters?: {
    userId?: number
    action?: string
    resourceType?: string
    resourceId?: number
    startDate?: Date
    endDate?: Date
    page?: number
    limit?: number
  }): Promise<{ logs: any[]; total: number }> {
    try {
      const page = filters?.page || 1
      const limit = filters?.limit || 50
      const offset = (page - 1) * limit

      let whereClause = "WHERE 1=1"
      const params: any[] = []

      if (filters?.userId) {
        whereClause += " AND user_id = ?"
        params.push(filters.userId)
      }

      if (filters?.action) {
        whereClause += " AND action = ?"
        params.push(filters.action)
      }

      if (filters?.resourceType) {
        whereClause += " AND resource_type = ?"
        params.push(filters.resourceType)
      }

      if (filters?.resourceId) {
        whereClause += " AND resource_id = ?"
        params.push(filters.resourceId)
      }

      if (filters?.startDate) {
        whereClause += " AND created_at >= ?"
        params.push(filters.startDate)
      }

      if (filters?.endDate) {
        whereClause += " AND created_at <= ?"
        params.push(filters.endDate)
      }

      const logs = await executeQuery(
        `SELECT al.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         ${whereClause}
         ORDER BY al.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      )

      const totalResult = await executeQuery<{ count: number }>(
        `SELECT COUNT(*) as count FROM audit_logs ${whereClause}`,
        params,
      )

      return {
        logs,
        total: totalResult[0].count,
      }
    } catch (error) {
      logger.error("Failed to retrieve audit logs:", error)
      throw new Error("Failed to retrieve audit logs")
    }
  }
}
