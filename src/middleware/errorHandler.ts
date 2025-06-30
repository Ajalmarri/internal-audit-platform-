import type { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/errors"
import { logger } from "../utils/logger"

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  let statusCode = 500
  let message = "Internal Server Error"
  let details: any = undefined

  // Log the error
  logger.error("Error occurred:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })

  if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
  } else if (error.name === "ValidationError") {
    statusCode = 400
    message = "Validation Error"
    details = error.message
  } else if (error.name === "CastError") {
    statusCode = 400
    message = "Invalid ID format"
  } else if (error.name === "JsonWebTokenError") {
    statusCode = 401
    message = "Invalid token"
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401
    message = "Token expired"
  } else if ((error as any).code === "ER_DUP_ENTRY") {
    statusCode = 409
    message = "Duplicate entry"
  } else if ((error as any).code === "ER_NO_REFERENCED_ROW_2") {
    statusCode = 400
    message = "Referenced record does not exist"
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Something went wrong"
    details = undefined
  }

  res.status(statusCode).json({
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}
