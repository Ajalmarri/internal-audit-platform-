import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/config"
import { UserService } from "../services/userService"
import { logger } from "../utils/logger"
import { AppError } from "../utils/errors"

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      throw new AppError("Access token required", 401)
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any

    // Verify user still exists and is active
    const userService = new UserService()
    const user = await userService.findById(decoded.userId)

    if (!user || !user.isActive) {
      throw new AppError("Invalid or expired token", 401)
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn("Invalid JWT token:", error.message)
      res.status(401).json({ error: "Invalid token" })
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {
      logger.error("Authentication error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

export const requireRole = (roles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" })
      return
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "Insufficient permissions",
        required: allowedRoles,
        current: req.user.role,
      })
      return
    }

    next()
  }
}

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" })
      return
    }

    // Define role-based permissions
    const rolePermissions: Record<string, string[]> = {
      admin: ["*"], // Admin has all permissions
      manager: [
        "audit:read",
        "audit:write",
        "audit:delete",
        "user:read",
        "user:write",
        "finding:read",
        "finding:write",
        "finding:delete",
      ],
      auditor: ["audit:read", "audit:write", "finding:read", "finding:write", "user:read"],
      viewer: ["audit:read", "finding:read", "user:read"],
    }

    const userPermissions = rolePermissions[req.user.role] || []

    if (!userPermissions.includes("*") && !userPermissions.includes(permission)) {
      res.status(403).json({
        error: "Insufficient permissions",
        required: permission,
        role: req.user.role,
      })
      return
    }

    next()
  }
}
