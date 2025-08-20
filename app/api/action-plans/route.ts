import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface ActionPlanFromDB {
  id: string
  description: string
  responsible_id: string
  due_date: string
  status_id: number
  finding_id: string
  finding_title: string
  finding_description: string
  objective: string
  priority_id: number
  effort: string
  created_date: string
  is_approved: boolean
}

export async function GET() {
  try {
    // Get action plans from the database with proper joins
    const rows = (await query(
      `SELECT
         CAST(ap.ActionPlanID AS CHAR) AS id,
         ap.ActionPlanDescription AS description,
         CAST(ap.ResponsibleID AS CHAR) AS responsible_id,
         ap.DueDate AS due_date,
         ap.ActionPlanStatusID AS status_id,
         CAST(ap.FindingID AS CHAR) AS finding_id,
         f.Title AS finding_title,
         f.FindingDescription AS finding_description,
         ap.Objective AS objective,
         ap.PriorityID AS priority_id,
         ap.Effort AS effort,
         ap.CreatedDate AS created_date,
         ap.IsApproved AS is_approved
       FROM actionplans ap
       LEFT JOIN findings f ON f.FindingID = ap.FindingID
       WHERE ap.IsDeleted = 0
       ORDER BY ap.ActionPlanID ASC`
    )) as ActionPlanFromDB[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch action plans from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to fetch action plans from database.", error: errorMessage },
      { status: 500 },
    )
  }
}
