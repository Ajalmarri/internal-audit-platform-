import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log('Managers API called')
    
    const managers = await query(
      `SELECT u.UserID, u.FirstName, u.LastName, ur.RoleName
       FROM users u
       JOIN userroles ur ON u.UserRoleID = ur.RoleID
       WHERE u.IsDeleted = 0 AND u.IsActive = 1 
       AND (ur.RoleName LIKE '%Manager%' OR ur.RoleName LIKE '%Auditor%' OR ur.RoleName LIKE '%Lead%')
       ORDER BY u.FirstName, u.LastName`
    ) as any[]

    console.log('Managers query result:', managers.length, 'managers found')

    // Transform the data to match the expected format
    const transformedManagers = managers.map(manager => ({
      id: manager.UserID.toString(),
      name: `${manager.FirstName} ${manager.LastName}`,
      role: manager.RoleName
    }))

    return NextResponse.json(transformedManagers)

  } catch (error) {
    console.error("Managers error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
