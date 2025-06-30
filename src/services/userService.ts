import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { executeQuery, executeTransaction } from "../config/database"
import { config } from "../config/config"
import type { User, CreateUserRequest, UpdateUserRequest, LoginRequest, LoginResponse } from "../types/user"
import { AppError } from "../utils/errors"
import { logger } from "../utils/logger"
import { AuditLogService } from "./auditLogService"

export class UserService {
  private auditLogService = new AuditLogService()

  async findById(id: number): Promise<User | null> {
    try {
      const users = await executeQuery<User>(
        "SELECT id, email, first_name as firstName, last_name as lastName, role, department, phone, is_active as isActive, email_verified as emailVerified, last_login as lastLogin, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = ?",
        [id],
      )

      return users[0] || null
    } catch (error) {
      logger.error("Error finding user by ID:", error)
      throw new AppError("Failed to find user", 500)
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const users = await executeQuery<User>(
        "SELECT id, email, first_name as firstName, last_name as lastName, role, department, phone, is_active as isActive, email_verified as emailVerified, last_login as lastLogin, created_at as createdAt, updated_at as updatedAt FROM users WHERE email = ?",
        [email],
      )

      return users[0] || null
    } catch (error) {
      logger.error("Error finding user by email:", error)
      throw new AppError("Failed to find user", 500)
    }
  }

  async findAll(page = 1, limit = 10, filters?: any): Promise<{ users: User[]; total: number }> {
    try {
      const offset = (page - 1) * limit
      let whereClause = "WHERE 1=1"
      const params: any[] = []

      if (filters?.role) {
        whereClause += " AND role = ?"
        params.push(filters.role)
      }

      if (filters?.department) {
        whereClause += " AND department = ?"
        params.push(filters.department)
      }

      if (filters?.isActive !== undefined) {
        whereClause += " AND is_active = ?"
        params.push(filters.isActive)
      }

      if (filters?.search) {
        whereClause += " AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)"
        const searchTerm = `%${filters.search}%`
        params.push(searchTerm, searchTerm, searchTerm)
      }

      const users = await executeQuery<User>(
        `SELECT id, email, first_name as firstName, last_name as lastName, role, department, phone, is_active as isActive, email_verified as emailVerified, last_login as lastLogin, created_at as createdAt, updated_at as updatedAt 
         FROM users ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      )

      const totalResult = await executeQuery<{ count: number }>(
        `SELECT COUNT(*) as count FROM users ${whereClause}`,
        params,
      )

      return {
        users,
        total: totalResult[0].count,
      }
    } catch (error) {
      logger.error("Error finding users:", error)
      throw new AppError("Failed to retrieve users", 500)
    }
  }

  async create(userData: CreateUserRequest, createdBy?: number): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email)
      if (existingUser) {
        throw new AppError("User with this email already exists", 409)
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, config.bcryptRounds)

      const result = await executeTransaction(async (connection) => {
        const [insertResult] = await connection.execute(
          "INSERT INTO users (email, password_hash, first_name, last_name, role, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            userData.email,
            passwordHash,
            userData.firstName,
            userData.lastName,
            userData.role,
            userData.department,
            userData.phone,
          ],
        )

        const userId = (insertResult as any).insertId

        // Log the creation
        if (createdBy) {
          await this.auditLogService.log({
            userId: createdBy,
            action: "CREATE_USER",
            resourceType: "user",
            resourceId: userId,
            newValues: { ...userData, password: "[REDACTED]" },
          })
        }

        return userId
      })

      const newUser = await this.findById(result)
      if (!newUser) {
        throw new AppError("Failed to create user", 500)
      }

      return newUser
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error("Error creating user:", error)
      throw new AppError("Failed to create user", 500)
    }
  }

  async update(id: number, userData: UpdateUserRequest, updatedBy?: number): Promise<User> {
    try {
      const existingUser = await this.findById(id)
      if (!existingUser) {
        throw new AppError("User not found", 404)
      }

      const result = await executeTransaction(async (connection) => {
        const updateFields: string[] = []
        const params: any[] = []

        if (userData.firstName !== undefined) {
          updateFields.push("first_name = ?")
          params.push(userData.firstName)
        }
        if (userData.lastName !== undefined) {
          updateFields.push("last_name = ?")
          params.push(userData.lastName)
        }
        if (userData.role !== undefined) {
          updateFields.push("role = ?")
          params.push(userData.role)
        }
        if (userData.department !== undefined) {
          updateFields.push("department = ?")
          params.push(userData.department)
        }
        if (userData.phone !== undefined) {
          updateFields.push("phone = ?")
          params.push(userData.phone)
        }
        if (userData.isActive !== undefined) {
          updateFields.push("is_active = ?")
          params.push(userData.isActive)
        }

        if (updateFields.length === 0) {
          return
        }

        updateFields.push("updated_at = CURRENT_TIMESTAMP")
        params.push(id)

        await connection.execute(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, params)

        // Log the update
        if (updatedBy) {
          await this.auditLogService.log({
            userId: updatedBy,
            action: "UPDATE_USER",
            resourceType: "user",
            resourceId: id,
            oldValues: existingUser,
            newValues: userData,
          })
        }
      })

      const updatedUser = await this.findById(id)
      if (!updatedUser) {
        throw new AppError("Failed to update user", 500)
      }

      return updatedUser
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error("Error updating user:", error)
      throw new AppError("Failed to update user", 500)
    }
  }

  async delete(id: number, deletedBy?: number): Promise<void> {
    try {
      const existingUser = await this.findById(id)
      if (!existingUser) {
        throw new AppError("User not found", 404)
      }

      await executeTransaction(async (connection) => {
        await connection.execute("DELETE FROM users WHERE id = ?", [id])

        // Log the deletion
        if (deletedBy) {
          await this.auditLogService.log({
            userId: deletedBy,
            action: "DELETE_USER",
            resourceType: "user",
            resourceId: id,
            oldValues: existingUser,
          })
        }
      })
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error("Error deleting user:", error)
      throw new AppError("Failed to delete user", 500)
    }
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      // Find user with password hash
      const users = await executeQuery<User & { passwordHash: string }>(
        "SELECT id, email, password_hash as passwordHash, first_name as firstName, last_name as lastName, role, department, phone, is_active as isActive, email_verified as emailVerified FROM users WHERE email = ? AND is_active = true",
        [loginData.email],
      )

      const user = users[0]
      if (!user) {
        throw new AppError("Invalid credentials", 401)
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(loginData.password, user.passwordHash)
      if (!isValidPassword) {
        throw new AppError("Invalid credentials", 401)
      }

      // Generate tokens
      const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      })

      const refreshToken = jwt.sign({ userId: user.id }, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpiresIn,
      })

      // Update last login
      await executeQuery("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", [user.id])

      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      logger.error("Error during login:", error)
      throw new AppError("Login failed", 500)
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any

      const user = await this.findById(decoded.userId)
      if (!user || !user.isActive) {
        throw new AppError("Invalid refresh token", 401)
      }

      const newAccessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      })

      const newRefreshToken = jwt.sign({ userId: user.id }, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpiresIn,
      })

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Invalid refresh token", 401)
      }
      logger.error("Error refreshing token:", error)
      throw new AppError("Token refresh failed", 500)
    }
  }
}
