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
  priority_name: string
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
         s.Severity AS priority_name,
         ap.Effort AS effort,
         ap.CreatedDate AS created_date,
         ap.IsApproved AS is_approved
       FROM actionplans ap
       LEFT JOIN findings f ON f.FindingID = ap.FindingID
       LEFT JOIN severities s ON s.SeverityID = ap.PriorityID
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Action Plan POST request body:", body)

    const {
      findingId,
      findingTitle,
      businessOwner,
      items,
      status,
      priority
    } = body

    // Validate required fields
    if (!findingId || !businessOwner || !items || items.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields: findingId, businessOwner, and items are required" },
        { status: 400 }
      )
    }

    // Get business owner ID
    const businessOwnerResult = await query(
      `SELECT PrimaryStakeholderID FROM primarystakeholders WHERE PrimaryStakeholder = ?`,
      [businessOwner]
    )
    
    if (!businessOwnerResult || businessOwnerResult.length === 0) {
      return NextResponse.json(
        { message: "Business owner not found" },
        { status: 400 }
      )
    }
    
    const responsibleId = businessOwnerResult[0].PrimaryStakeholderID

    // Get priority ID (map priority names to IDs)
    const priorityMap: { [key: string]: number } = {
      "Low": 1,
      "Medium": 2, 
      "High": 3,
      "Critical": 4
    }
    const priorityId = priorityMap[priority] || 2 // Default to Medium

    // Get status ID (map status names to IDs)
    const statusMap: { [key: string]: number } = {
      "Draft": 1,
      "Submitted": 2,
      "Accepted": 3,
      "Rejected": 4
    }
    const statusId = statusMap[status] || 2 // Default to Submitted

    // Create action plan for each item
    const actionPlanIds = []
    
    for (const item of items) {
      if (!item.action || !item.responsiblePerson || !item.dueDate) {
        continue // Skip incomplete items
      }

      // Get responsible person ID (for now, use the same business owner ID)
      const responsiblePersonId = responsibleId

      // Convert due date to MySQL format
      const dueDate = new Date(item.dueDate).toISOString().split('T')[0]

      const result = await query(
        `INSERT INTO actionplans 
         (ActionPlanDescription, ResponsibleID, DueDate, ActionPlanStatusID, FindingID, 
          IsApproved, PriorityID, Objective, Criteria, Effort, CreatedBy, ModifiedBy) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.action,
          responsiblePersonId,
          dueDate,
          statusId,
          parseInt(findingId),
          status === "Accepted" ? 1 : 0,
          priorityId,
          item.description || "", // Use item description as objective
          "", // Empty criteria since we removed it
          "", // Empty effort since we removed it
          1, // CreatedBy (assuming user ID 1)
          1  // ModifiedBy (assuming user ID 1)
        ]
      )

      actionPlanIds.push(result.insertId)
    }

    console.log("Action plans created successfully:", actionPlanIds)

    return NextResponse.json({
      message: "Action plan created successfully",
      actionPlanIds,
      status: status
    })

  } catch (error) {
    console.error("Failed to create action plan:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to create action plan.", error: errorMessage },
      { status: 500 }
    )
  }
}
