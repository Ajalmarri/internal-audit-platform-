import { NextResponse } from "next/server"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// WARNING: Hardcoding connection strings is not recommended for production environments.
// This should be replaced with a secure way of managing secrets, like environment variables.
// You can get your connection string from your Neon project dashboard.
const DATABASE_URL = "YOUR_NEON_DATABASE_CONNECTION_STRING_HERE"

let sql: NeonQueryFunction<false, false>

// Initialize the sql client if the connection string is provided and not a placeholder.
if (DATABASE_URL && DATABASE_URL !== "YOUR_NEON_DATABASE_CONNECTION_STRING_HERE") {
  sql = neon(DATABASE_URL)
} else {
  // This console.warn will appear in Vercel function logs if the variable is missing.
  console.warn(
    "Database connection string is not set in app/api/audit-plans/route.ts. API will not connect to the database. Please replace the placeholder value.",
  )
}

interface AuditPlanFromDB {
  id: string
  title: string
}

export async function GET() {
  // If sql client wasn't initialized due to missing/placeholder connection string, return an error.
  if (!sql) {
    console.error("Database connection is not available in /api/audit-plans because the connection string is not set.")
    return NextResponse.json(
      { message: "Database connection not configured. Please update the connection string in the source code." },
      { status: 500 },
    )
  }

  try {
    const auditPlans: AuditPlanFromDB[] = await sql<AuditPlanFromDB[]>`
    SELECT id, title 
    FROM audit_plans 
    ORDER BY title ASC
  `

    // If the query executes but returns no rows, auditPlans will be an empty array.
    // This is a valid state (no plans found) and should be handled by the frontend.
    return NextResponse.json(auditPlans)
  } catch (error) {
    console.error("Failed to fetch audit plans from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    // This error will be sent to the client if the database query fails.
    return NextResponse.json(
      { message: "Failed to fetch audit plans from database.", error: errorMessage },
      { status: 500 },
    )
  }
}
