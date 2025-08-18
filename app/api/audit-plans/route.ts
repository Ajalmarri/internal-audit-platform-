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
  is_deleted: number
}

export async function GET() {
  try {
    // Get ALL audit plans including deleted ones
    const rows = (await query(
      `SELECT 
         CAST(ap.PlanID AS CHAR) AS id,
         ap.PlanName AS title,
         CAST(ap.PlanYear AS CHAR) AS year,
         COALESCE(aps.StatusName, 'Unknown Status') AS status,
         ap.Progress AS progress,
         NULL AS start_date,
         NULL AS end_date,
         ap.CreatedDate AS created_at,
         ap.ModifiedDate AS updated_at,
         ap.IsDeleted AS is_deleted
       FROM auditplans ap
       LEFT JOIN auditplanstatuses aps ON aps.StatusID = ap.PlanStatusID
       ORDER BY ap.PlanID ASC`
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
