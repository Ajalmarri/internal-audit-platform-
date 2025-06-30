import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const configSchema = z.object({
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),
  port: z.string().transform(Number).default("3000"),

  // Database configuration
  dbHost: z.string().default("localhost"),
  dbPort: z.string().transform(Number).default("3306"),
  dbName: z.string().min(1),
  dbUser: z.string().min(1),
  dbPassword: z.string().min(1),
  dbConnectionLimit: z.string().transform(Number).default("10"),

  // JWT configuration
  jwtSecret: z.string().min(32),
  jwtExpiresIn: z.string().default("24h"),
  jwtRefreshSecret: z.string().min(32),
  jwtRefreshExpiresIn: z.string().default("7d"),

  // Security configuration
  bcryptRounds: z.string().transform(Number).default("12"),
  allowedOrigins: z
    .string()
    .transform((str) => str.split(","))
    .default("http://localhost:3000"),

  // Redis configuration (for caching and sessions)
  redisUrl: z.string().optional(),

  // Email configuration
  emailHost: z.string().optional(),
  emailPort: z.string().transform(Number).optional(),
  emailUser: z.string().optional(),
  emailPassword: z.string().optional(),

  // File upload configuration
  maxFileSize: z.string().transform(Number).default("10485760"), // 10MB
  uploadPath: z.string().default("./uploads"),

  // Monitoring
  logLevel: z.enum(["error", "warn", "info", "debug"]).default("info"),
})

const parseConfig = () => {
  try {
    return configSchema.parse({
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,

      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      dbName: process.env.DB_NAME,
      dbUser: process.env.DB_USER,
      dbPassword: process.env.DB_PASSWORD,
      dbConnectionLimit: process.env.DB_CONNECTION_LIMIT,

      jwtSecret: process.env.JWT_SECRET,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,

      bcryptRounds: process.env.BCRYPT_ROUNDS,
      allowedOrigins: process.env.ALLOWED_ORIGINS,

      redisUrl: process.env.REDIS_URL,

      emailHost: process.env.EMAIL_HOST,
      emailPort: process.env.EMAIL_PORT,
      emailUser: process.env.EMAIL_USER,
      emailPassword: process.env.EMAIL_PASSWORD,

      maxFileSize: process.env.MAX_FILE_SIZE,
      uploadPath: process.env.UPLOAD_PATH,

      logLevel: process.env.LOG_LEVEL,
    })
  } catch (error) {
    console.error("Configuration validation failed:", error)
    process.exit(1)
  }
}

export const config = parseConfig()
