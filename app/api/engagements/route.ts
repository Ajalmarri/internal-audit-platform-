import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface EngagementFromDB {
  id: string
  title: string
  stakeholder: string
  manager: string
  start_date: string
  end_date: string
  status: string
  objective?: string
  scope?: string
  created_at: string
  updated_at: string
}

export async function GET() {
  try {
    const rows = (await query(
      `SELECT
         e.engagementid::text AS id,
         e.engagementtitle AS title,
         ps.primarystakeholder AS stakeholder,
         CONCAT(u.firstname, ' ', u.lastname) AS manager,
         e.startdate AS start_date,
         e.enddate AS end_date,
         es.engagementstatus AS status,
         e.objective AS objective,
         e.scope AS scope,
         e.createddate AS created_at,
         e.modifieddate AS updated_at
       FROM engagements e
       LEFT JOIN primarystakeholders ps ON ps.primarystakeholderid = e.primarystakeholderid
       LEFT JOIN users u ON u.userid = e.engagementmanagerid
       LEFT JOIN engagementstatuses es ON es.engagementstatusid = e.statusid
       WHERE COALESCE(e.isdeleted, false) = false
       ORDER BY e.engagementid ASC`,
    )) as EngagementFromDB[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch engagements from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to fetch engagements from database.", error: errorMessage },
      { status: 500 },
    )
  }
}
