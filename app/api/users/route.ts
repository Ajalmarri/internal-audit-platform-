import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const users = await query(`
      SELECT 
        u.UserID as id,
        CONCAT(u.FirstName, ' ', u.LastName) as name,
        u.Email as email,
        ur.RoleName as role
      FROM users u
      LEFT JOIN userroles ur ON u.UserRoleID = ur.RoleID
      WHERE u.IsDeleted = 0 AND u.IsActive = 1
      ORDER BY u.FirstName, u.LastName
    `)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 })
  }
}









