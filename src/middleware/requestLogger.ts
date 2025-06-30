import type { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  // Log request
  logger.info(`${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    userId: (req as any).user?.id,
  })

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start
    const logLevel = res.statusCode >= 400 ? "error" : "info"

    logger[logLevel](`${req.method} ${req.originalUrl} - ${res.statusCode}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).user?.id,
    })
  })

  next()
}
