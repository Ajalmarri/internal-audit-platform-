import { neon } from "@neondatabase/serverless"

console.log("[v0] DATABASE_URL exists:", !!process.env.DATABASE_URL)
console.log("[v0] DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20))

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Use Neon PostgreSQL connection from environment variables
const sql = neon(process.env.DATABASE_URL!)

export async function query(sqlQuery: string, params?: any[]) {
  try {
    console.log("[v0] Executing query:", sqlQuery)
    console.log("[v0] With params:", params)

    // Convert MySQL-style ? placeholders to PostgreSQL-style $1, $2, etc.
    let convertedQuery = sqlQuery
    let paramIndex = 1

    while (convertedQuery.includes("?")) {
      convertedQuery = convertedQuery.replace("?", `$${paramIndex}`)
      paramIndex++
    }

    console.log("[v0] Converted query:", convertedQuery)

    const result = await sql(convertedQuery, params || [])
    console.log("[v0] Query result:", result)
    return result
  } catch (error) {
    console.error("[v0] Database query error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    throw new Error(`Database connection error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Test connection function
export async function testConnection() {
  try {
    await sql("SELECT 1")
    console.log("Neon PostgreSQL connection successful")
    return true
  } catch (error) {
    console.error("Neon PostgreSQL connection failed:", error)
    return false
  }
}

// Legacy functions for compatibility
export async function getConnection() {
  // Return a mock connection object for compatibility
  return {
    execute: async (query: string, params?: any[]) => {
      const result = await sql(query, params || [])
      return [result]
    },
  }
}

export async function closeConnection() {
  // Neon serverless doesn't require explicit connection closing
  console.log("Connection cleanup completed")
}
