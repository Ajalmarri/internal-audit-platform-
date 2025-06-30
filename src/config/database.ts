import mysql from "mysql2/promise"
import { config } from "./config"
import { logger } from "../utils/logger"

let pool: mysql.Pool

export const connectDatabase = async (): Promise<void> => {
  try {
    pool = mysql.createPool({
      host: config.dbHost,
      port: config.dbPort,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      connectionLimit: config.dbConnectionLimit,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      charset: "utf8mb4",
      timezone: "+00:00",
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: false,
      multipleStatements: false,
    })

    // Test the connection
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()

    logger.info("MySQL database connected successfully")
  } catch (error) {
    logger.error("Database connection failed:", error)
    throw error
  }
}

export const getPool = (): mysql.Pool => {
  if (!pool) {
    throw new Error("Database pool not initialized. Call connectDatabase() first.")
  }
  return pool
}

export const executeQuery = async <T = any>(query: string, params?: any[]): Promise<T[]> => {
  try {
    const [rows] = await pool.execute(query, params)
    return rows as T[]
  } catch (error) {
    logger.error("Database query error:", { query, params, error })
    throw error
  }
}

export const executeTransaction = async <T>(\
  callback: (connection: mysql.PoolConnection) => Promise<T>\
)
: Promise<T> =>
{
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result;
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
