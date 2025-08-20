import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    // Fetch team members from the assignment's AssigneeID field
    const rows = await query(
      `SELECT 
         CAST(a.AssigneeID AS CHAR) AS id,
         u.FirstName,
         u.LastName,
         u.Email,
         ur.RoleName AS role,
         'Team Member' AS assignmentRole,
         a.CreatedDate AS assignedDate,
         1 AS isActive
       FROM assignments a
       LEFT JOIN users u ON u.UserID = a.AssigneeID
       LEFT JOIN userroles ur ON ur.RoleID = u.UserRoleID
       WHERE a.AssignmentID = ? AND IFNULL(a.IsDeleted, 0) = 0`,
      [assignmentId]
    ) as any[]

    // Transform the data to match the frontend interface
    const teamMembers = rows.map((member: any) => ({
      id: member.id,
      name: `${member.FirstName || ''} ${member.LastName || ''}`.trim() || "Unknown User",
      email: member.Email || "",
      role: member.role || "Member",
      assignmentRole: member.assignmentRole || "Team Member",
      assignedDate: member.assignedDate,
      isActive: member.isActive,
      avatar: "/placeholder.svg?width=40&height=40" // Default avatar
    }))

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error("Failed to fetch team members:", error)
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const body = await request.json()

    if (!assignmentId) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 })
    }

    if (!body.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Update the assignment's AssigneeID field
    await query(
      `UPDATE assignments 
       SET AssigneeID = ?, ModifiedDate = NOW(), ModifiedBy = 1
       WHERE AssignmentID = ?`,
      [body.userId, assignmentId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to add team member:", error)
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    )
  }
}
