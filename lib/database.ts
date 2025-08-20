import { neon } from "@neondatabase/serverless"

// Use Neon PostgreSQL connection from environment variables
const sql = neon(process.env.DATABASE_URL!)

export async function query(sqlQuery: string, params?: any[]) {
  try {
    console.log("Executing query:", sqlQuery)
    console.log("With params:", params)

    // Convert MySQL-style ? placeholders to PostgreSQL-style $1, $2, etc.
    let convertedQuery = sqlQuery
    let paramIndex = 1

    while (convertedQuery.includes("?")) {
      convertedQuery = convertedQuery.replace("?", `$${paramIndex}`)
      paramIndex++
    }

    console.log("Converted query:", convertedQuery)

    const result = await sql(convertedQuery, params || [])
    console.log("Query result:", result)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
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
