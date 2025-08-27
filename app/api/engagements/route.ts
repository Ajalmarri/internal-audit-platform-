import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log('Engagements API called - GET')
    
    const engagements = await query(
      `SELECT e.EngagementID, e.EngagementTitle, e.Objective, e.Scope, e.StartDate, e.EndDate, 
              es.EngagementStatus, ps.PrimaryStakeholder, u.FirstName, u.LastName
       FROM engagements e
       LEFT JOIN primarystakeholders ps ON ps.PrimaryStakeholderID = e.PrimaryStakeholderID
       LEFT JOIN users u ON u.UserID = e.EngagementManagerID
       LEFT JOIN engagementstatuses es ON es.EngagementStatusID = e.StatusID
       WHERE e.IsDeleted = 0
       ORDER BY e.CreatedDate DESC`
    ) as any[]

    console.log('Engagements query result:', engagements.length, 'engagements found')

    // Transform the data to match the expected format
    const transformedEngagements = engagements.map(engagement => ({
      id: engagement.EngagementID,
      title: engagement.EngagementTitle,
      objective: engagement.Objective,
      scope: engagement.Scope,
      startDate: engagement.StartDate ? new Date(engagement.StartDate).toISOString().split('T')[0] : null,
      endDate: engagement.EndDate ? new Date(engagement.EndDate).toISOString().split('T')[0] : null,
      status: engagement.EngagementStatus,
      stakeholder: engagement.PrimaryStakeholder,
      manager: `${engagement.FirstName} ${engagement.LastName}`
    }))

    return NextResponse.json(transformedEngagements)

  } catch (error) {
    console.error("Engagements error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Engagements API called - POST (Create new engagement)')
    
    const body = await request.json()
    const {
      title,
      objective,
      scope,
      stakeholderId,
      managerId,
      startDate,
      endDate,
      assignmentIds
    } = body

    console.log('Creating engagement with data:', body)

    // Format dates for MySQL (YYYY-MM-DD format)
    const formatDateForMySQL = (dateString: string) => {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0] // Extract just the date part
    }

    const formattedStartDate = formatDateForMySQL(startDate)
    const formattedEndDate = formatDateForMySQL(endDate)

    console.log('Formatted dates - Start:', formattedStartDate, 'End:', formattedEndDate)

    // Get a default status ID (assuming 'Active' status exists)
    const statusResult = await query(
      `SELECT EngagementStatusID FROM engagementstatuses WHERE EngagementStatus = 'Active' LIMIT 1`
    ) as any[]
    
    const statusId = statusResult.length > 0 ? statusResult[0].EngagementStatusID : 1

    // Insert the new engagement
    const result = await query(
      `INSERT INTO engagements (
        EngagementTitle, 
        Objective, 
        Scope, 
        PrimaryStakeholderID, 
        EngagementManagerID, 
        StartDate, 
        EndDate, 
        StatusID,
        AssignmentID,
        CreatedBy,
        ModifiedBy,
        IsDeleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [title, objective, scope, stakeholderId, managerId, formattedStartDate, formattedEndDate, statusId, 1, 1, 1]
    ) as any

    const engagementId = result.insertId
    console.log('Engagement created with ID:', engagementId)

    // If assignment IDs are provided, try to link them to the engagement
    if (assignmentIds && assignmentIds.length > 0) {
      try {
        for (const assignmentId of assignmentIds) {
          await query(
            `INSERT INTO engagementassignments (EngagementID, AssignmentID, CreatedDate) VALUES (?, ?, NOW())`,
            [engagementId, assignmentId]
          )
        }
        console.log('Linked', assignmentIds.length, 'assignments to engagement')
      } catch (error) {
        console.warn('Could not link assignments (table may not exist):', error)
        // Continue without failing the engagement creation
      }
    }

    return NextResponse.json({
      success: true,
      message: "Engagement initiated successfully!",
      id: engagementId
    })

  } catch (error) {
    console.error("Create engagement error:", error)
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to create engagement. Please try again." 
      },
      { status: 500 }
    )
  }
}

