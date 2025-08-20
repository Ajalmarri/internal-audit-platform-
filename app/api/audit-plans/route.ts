import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface AuditPlanFromDB {
  id: string
  title: string
  year: string
  status?: string
  progress?: number
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
  is_deleted: boolean
}

export async function GET() {
  try {
    const rows = (await query(
      `SELECT 
         ap.planid::text AS id,
         ap.planname AS title,
         ap.planyear::text AS year,
         COALESCE(aps.statusname, 'Unknown Status') AS status,
         ap.progress AS progress,
         NULL AS start_date,
         NULL AS end_date,
         ap.createddate AS created_at,
         ap.modifieddate AS updated_at,
         ap.isdeleted AS is_deleted
       FROM auditplans ap
       LEFT JOIN auditplanstatuses aps ON aps.statusid = ap.planstatusid
       WHERE ap.isdeleted = false
       ORDER BY ap.planid ASC`,
    )) as AuditPlanFromDB[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch audit plans from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to fetch audit plans from database.", error: errorMessage },
      { status: 500 },
    )
  }
}
