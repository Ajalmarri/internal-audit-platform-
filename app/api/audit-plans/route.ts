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

interface CreateAuditPlanRequest {
  title: string
  year: string
  status?: string
  description?: string
  start_date?: string
  end_date?: string
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

export async function POST(request: Request) {
  try {
    const body: CreateAuditPlanRequest = await request.json()
    
    // Validate required fields
    if (!body.title || !body.year) {
      return NextResponse.json({ message: "Title and year are required" }, { status: 400 })
    }

    // Get default status ID if not provided
    let statusId = 1 // Default to first status
    
    if (body.status) {
      const statusResult = await query('SELECT StatusID FROM auditplanstatuses WHERE StatusName = ?', [body.status])
      if (Array.isArray(statusResult) && statusResult.length > 0) {
        statusId = (statusResult[0] as any).StatusID
      }
    }

    // Get default user ID (required field)
    const userResult = await query('SELECT UserID FROM users LIMIT 1')
    const userId = Array.isArray(userResult) && userResult.length > 0 ? (userResult[0] as any).UserID : 1

    // Insert new audit plan using the correct schema
    const result = await query(
      `INSERT INTO auditplans (
        PlanName, 
        PlanYear, 
        PlanStatusID,
        Progress,
        CreatedDate,
        ModifiedDate,
        CreatedBy,
        ModifiedBy,
        IsDeleted
      ) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
      [
        body.title,
        body.year,
        statusId,
        0, // Default progress to 0
        userId, // CreatedBy
        userId, // ModifiedBy
      ]
    )

    const insertResult = result as any
    const newPlanId = insertResult.insertId

    // Fetch the newly created audit plan
    const newPlan = await query(
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
       WHERE ap.PlanID = ?`,
      [newPlanId]
    )

    return NextResponse.json({
      message: "Audit plan created successfully",
      auditPlan: Array.isArray(newPlan) ? newPlan[0] : newPlan
    }, { status: 201 })

  } catch (error) {
    console.error("Failed to create audit plan:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to create audit plan.", error: errorMessage },
      { status: 500 }
    )
  }
}
