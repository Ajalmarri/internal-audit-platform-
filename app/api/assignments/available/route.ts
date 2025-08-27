import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const engagementId = searchParams.get('engagementId')

    if (!engagementId) {
      return NextResponse.json(
        { message: "Engagement ID is required" },
        { status: 400 }
      )
    }

    // Get all assignments with their details and check if they're already linked
    const assignments = await query(`
      SELECT 
        a.AssignmentID,
        a.AssignmentName,
        a.AssignmentDescription,
        a.AssignmentStatusID,
        a.AssignmentTypeID,
        a.AssignmentStartDate,
        a.AssignmentDueDate,
        a.AssigneeID,
        ast.StatusName,
        u.FirstName,
        u.LastName,
        at.AssignmentType as TypeName,
        CASE WHEN ea.EngagementID IS NOT NULL THEN 1 ELSE 0 END as IsLinked
      FROM assignments a
      LEFT JOIN assignmentstatuses ast ON a.AssignmentStatusID = ast.StatusID
      LEFT JOIN users u ON a.AssigneeID = u.UserID
              LEFT JOIN assignmenttypes at ON a.AssignmentTypeID = at.TypeID
      LEFT JOIN engagementassignments ea ON a.AssignmentID = ea.AssignmentID AND ea.EngagementID = ?
      WHERE a.IsDeleted = 0
      ORDER BY a.AssignmentName ASC
    `, [engagementId]) as any[]

    // Transform the data to include assignee name
    const transformedAssignments = assignments.map(assignment => ({
      ...assignment,
      AssigneeName: `${assignment.FirstName} ${assignment.LastName}`.trim() || 'Unassigned'
    }))

    return NextResponse.json({
      assignments: transformedAssignments,
      total: transformedAssignments.length
    })

  } catch (error) {
    console.error("Available assignments error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
