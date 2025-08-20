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
    // Get engagements with proper column mapping and joins
    const rows = (await query(
      `SELECT
         CAST(e.EngagementID AS CHAR) AS id,
         e.EngagementTitle AS title,
         ps.PrimaryStakeholder AS stakeholder,
         CONCAT(u.FirstName, ' ', u.LastName) AS manager,
         e.StartDate AS start_date,
         e.EndDate AS end_date,
         es.EngagementStatus AS status,
         e.Objective AS objective,
         e.Scope AS scope,
         e.CreatedDate AS created_at,
         e.ModifiedDate AS updated_at
       FROM engagements e
       LEFT JOIN primarystakeholders ps ON ps.PrimaryStakeholderID = e.PrimaryStakeholderID
       LEFT JOIN users u ON u.UserID = e.EngagementManagerID
       LEFT JOIN engagementstatuses es ON es.EngagementStatusID = e.StatusID
       WHERE IFNULL(e.IsDeleted, 0) = 0
       ORDER BY e.EngagementID ASC`
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
