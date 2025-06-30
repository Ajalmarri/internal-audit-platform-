import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
import { config } from "../config/config"
import { AppError } from "../utils/errors"
import { logger } from "../utils/logger"

// Extend Express Request type to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: string
        permissions: string[]
      }
    }
  }
}

// List of all valid permissions in the system
const validPermissions = new Set([
  "admin",
  "read_users",
  "write_users",
  "read_audits",
  "write_audits",
  "read_compliance",
  "create_compliance",
  "read_risk",
  "create_risk",
  "read_widgets", // <-- New permission added
])

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return next(new AppError("Authentication token is required", 401))
  }

  jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
    if (err) {
      logger.warn("JWT verification failed", { error: err.message })
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Authentication token has expired", 401))
      }
      return next(new AppError("Invalid authentication token", 403))
    }

    req.user = {
      id: user.id,
      role: user.role,
      permissions: user.permissions || [],
    }
    next()
  })
}

export const requirePermission = (permission: string) => {
  if (!validPermissions.has(permission)) {
    logger.error(`Invalid permission '${permission}' used in requirePermission middleware.`)
    // This is a server configuration error, so we throw a 500
    throw new AppError("Internal Server Error: Invalid permission specified.", 500)
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401))
    }

    const { role, permissions } = req.user

    // Admin role has all permissions
    if (role === "admin" || permissions.includes(permission)) {
      return next()
    }

    return next(new AppError("You do not have permission to perform this action", 403))
  }
}
