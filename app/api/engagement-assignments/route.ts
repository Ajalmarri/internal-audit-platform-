import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { engagementId, assignmentId } = body

    if (!engagementId || !assignmentId) {
      return NextResponse.json(
        { message: "Engagement ID and Assignment ID are required" },
        { status: 400 }
      )
    }

    // Check if the assignment is already linked to this engagement
    const existingLink = await query(`
      SELECT EngagementAssignmentID 
      FROM engagementassignments 
      WHERE EngagementID = ? AND AssignmentID = ?
    `, [engagementId, assignmentId]) as any[]

    if (existingLink.length > 0) {
      return NextResponse.json(
        { message: "Assignment is already linked to this engagement" },
        { status: 409 }
      )
    }

    // Link the assignment to the engagement
    const result = await query(`
      INSERT INTO engagementassignments (EngagementID, AssignmentID, CreatedBy) 
      VALUES (?, ?, 1)
    `, [engagementId, assignmentId]) as any

    console.log(`Assignment ${assignmentId} linked to engagement ${engagementId}`)

    return NextResponse.json({
      message: "Assignment linked successfully",
      engagementAssignmentId: result.insertId
    })

  } catch (error) {
    console.error("Link assignment error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { engagementId, assignmentId } = body

    if (!engagementId || !assignmentId) {
      return NextResponse.json(
        { message: "Engagement ID and Assignment ID are required" },
        { status: 400 }
      )
    }

    // Check if the assignment is actually linked to this engagement
    const existingLink = await query(`
      SELECT EngagementAssignmentID 
      FROM engagementassignments 
      WHERE EngagementID = ? AND AssignmentID = ?
    `, [engagementId, assignmentId]) as any[]

    if (existingLink.length === 0) {
      return NextResponse.json(
        { message: "Assignment is not linked to this engagement" },
        { status: 404 }
      )
    }

    // Unlink the assignment from the engagement
    await query(`
      DELETE FROM engagementassignments 
      WHERE EngagementID = ? AND AssignmentID = ?
    `, [engagementId, assignmentId])

    console.log(`Assignment ${assignmentId} unlinked from engagement ${engagementId}`)

    return NextResponse.json({
      message: "Assignment unlinked successfully"
    })

  } catch (error) {
    console.error("Unlink assignment error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
