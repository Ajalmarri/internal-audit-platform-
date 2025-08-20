import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface AssignmentFromDB {
  id: string
  title: string
  description?: string
  status?: string
  audit_plan_id?: string
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
}

export async function GET() {
  try {
    // Get assignments with proper column mapping
    const rows = (await query(
      `SELECT 
         a.assignmentid::text AS id,
         a.assignmentname AS title,
         ast.statusname AS status,
         a.planid::text AS audit_plan_id,
         a.createddate AS created_at,
         a.modifieddate AS updated_at,
         a.assignmentduedate AS end_date,
         NULL AS description,
         NULL AS start_date
       FROM assignments a
       LEFT JOIN assignmentstatuses ast ON ast.statusid = a.assignmentstatusid
       WHERE COALESCE(a.isdeleted, false) = false
       ORDER BY a.createddate DESC`,
    )) as AssignmentFromDB[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch assignments from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to fetch assignments from database.", error: errorMessage },
      { status: 500 },
    )
  }
}
