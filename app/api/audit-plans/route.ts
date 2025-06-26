// No changes needed in this file.
// The existing code correctly identifies that DATABASE_URL is not set.
import { NextResponse } from "next/server"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let sql: NeonQueryFunction<false, false>

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL)
} else {
  console.warn(
    "DATABASE_URL environment variable is not set. API route /api/audit-plans will not connect to the database.",
  )
}

interface AuditPlanFromDB {
  id: string
  title: string
}

export async function GET() {
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

    if (!auditPlans) {
      console.warn("/api/audit-plans: Query returned undefined/null, sending empty array.")
      return NextResponse.json([])
    }
    return NextResponse.json(auditPlans)
  } catch (error) {
    console.error("Failed to fetch audit plans from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ message: "Failed to fetch audit plans.", error: errorMessage }, { status: 500 })
  }
}
