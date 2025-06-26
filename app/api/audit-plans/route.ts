import { NextResponse } from "next/server"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let sql: NeonQueryFunction<false, false>

// This check is important. If DATABASE_URL is not set in Vercel, this API will fail.
if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL)
} else {
  // This console.warn will appear in Vercel function logs if the variable is missing.
  console.warn(
    "DATABASE_URL environment variable is not set. API route /api/audit-plans will not connect to the database.",
  )
}

interface AuditPlanFromDB {
  id: string
  title: string
}

export async function GET() {
  // If sql client wasn't initialized due to missing DATABASE_URL, return an error.
  if (!sql) {
    console.error("Database connection is not available in /api/audit-plans because DATABASE_URL is not set.")
    return NextResponse.json({ message: "Database connection not configured." }, { status: 500 })
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
    return NextResponse.json({ message: "Failed to fetch audit plans from database.", error: errorMessage }, { status: 500 })
  }
}
