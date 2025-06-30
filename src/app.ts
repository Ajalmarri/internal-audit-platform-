import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import compression from "compression"
import morgan from "morgan"
import { config } from "./config/config"
import { errorHandler } from "./middleware/errorHandler"
import { logger } from "./utils/logger"
import { connectDatabase } from "./config/database"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/users"
import auditRoutes from "./routes/audits"
import { authenticateToken } from "./middleware/auth"

const app = express()

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// CORS configuration
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/audits", authenticateToken, auditRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found on this server.",
    path: req.originalUrl,
  })
})

// Global error handler
app.use(errorHandler)

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDatabase()
    logger.info("Database connected successfully")

    const port = config.port || 3000
    app.listen(port, () => {
      logger.info(`Server running on port ${port} in ${config.nodeEnv} mode`)
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})

if (require.main === module) {
  startServer()
}

export default app
