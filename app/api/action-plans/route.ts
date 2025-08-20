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
    const rows = (await query(
      `SELECT
         ap.actionplanid::text AS id,
         ap.actionplandescription AS description,
         ap.responsibleid::text AS responsible_id,
         ap.duedate AS due_date,
         ap.actionplanstatusid AS status_id,
         ap.findingid::text AS finding_id,
         f.title AS finding_title,
         f.findingdescription AS finding_description,
         ap.objective AS objective,
         ap.priorityid AS priority_id,
         ap.effort AS effort,
         ap.createddate AS created_date,
         ap.isapproved AS is_approved
       FROM actionplans ap
       LEFT JOIN findings f ON f.findingid = ap.findingid
       WHERE COALESCE(ap.isdeleted, false) = false
       ORDER BY ap.actionplanid ASC`,
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
