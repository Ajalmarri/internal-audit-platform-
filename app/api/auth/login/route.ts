import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

interface LoginRequest {
  email: string
  password: string
}

interface User {
  userid: number
  email: string
  firstname: string
  lastname: string
  userroleid: number
  isactive: boolean
  isdeleted: boolean
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login API called")
    const { email, password }: LoginRequest = await request.json()
    console.log("[v0] Login attempt for email:", email)

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Querying user from database...")
    let users: User[]
    try {
      users = (await query(
        `SELECT userid, email, firstname, lastname, userroleid, isactive, isdeleted
         FROM users 
         WHERE email = $1 AND isdeleted = false`,
        [email],
      )) as User[]
      console.log("[v0] User query successful, found:", users.length, "users")
    } catch (dbError) {
      console.error("[v0] Database query error:", dbError)
      return NextResponse.json({ message: "Database connection error" }, { status: 500 })
    }

    if (users.length === 0) {
      console.log("[v0] No user found with email:", email)
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]
    console.log("[v0] User found:", { userid: user.userid, email: user.email, isactive: user.isactive })

    // Check if user is active
    if (!user.isactive) {
      console.log("[v0] User account is deactivated")
      return NextResponse.json({ message: "Account is deactivated" }, { status: 401 })
    }

    // For demo purposes, accept any password for existing users
    // In production, you would implement proper password authentication
    console.log("[v0] User found, accepting login for demo purposes")

    let roles: any[]
    try {
      roles = (await query(`SELECT rolename FROM userroles WHERE roleid = $1`, [user.userroleid])) as any[]
      console.log("[v0] Role query successful, found:", roles.length, "roles")
    } catch (roleError) {
      console.error("[v0] Role query error:", roleError)
      return NextResponse.json({ message: "Role lookup error" }, { status: 500 })
    }

    const roleName = roles.length > 0 ? roles[0].rolename : "Unknown"
    console.log("[v0] User role:", roleName)

    // Create session data (in production, use proper session management)
    const sessionData = {
      userID: user.userid,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      roleID: user.userroleid,
      roleName: roleName,
      isAuthenticated: true,
    }

    // Set session cookie (in production, use secure session management)
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        UserID: user.userid,
        Email: user.email,
        FirstName: user.firstname,
        LastName: user.lastname,
        UserRoleID: user.userroleid,
        RoleName: roleName,
      },
    })

    // Set a simple session cookie (in production, use proper session management)
    response.cookies.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("[v0] Login successful for user:", user.email)
    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
