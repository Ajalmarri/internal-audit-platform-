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
         CAST(a.AssignmentID AS CHAR) AS id,
         a.AssignmentName AS title,
         ast.StatusName AS status,
         CAST(a.PlanID AS CHAR) AS audit_plan_id,
         a.CreatedDate AS created_at,
         a.ModifiedDate AS updated_at,
         a.AssignmentDueDate AS end_date,
         NULL AS description,
         NULL AS start_date
       FROM assignments a
       LEFT JOIN assignmentstatuses ast ON ast.StatusID = a.AssignmentStatusID
       WHERE IFNULL(a.IsDeleted, 0) = 0
       ORDER BY a.CreatedDate DESC`
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
