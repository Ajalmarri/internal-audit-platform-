import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import bcrypt from "bcryptjs"

interface LoginRequest {
  email: string
  password: string
}

interface User {
  UserID: number
  Email: string
  FirstName: string
  LastName: string
  UserRoleID: number
  IsActive: number
  IsDeleted: number
}

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called')
    const { email, password }: LoginRequest = await request.json()
    console.log('Login attempt for email:', email)

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log('Querying user from database...')
    // Query user from database (no password column exists)
    const users = (await query(
      `SELECT UserID, Email, FirstName, LastName, UserRoleID, IsActive, IsDeleted
       FROM users 
       WHERE Email = ? AND IsDeleted = 0`,
      [email]
    )) as User[]
    console.log('User query result:', users.length, 'users found')

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    const user = users[0]

    // Check if user is active
    if (!user.IsActive) {
      return NextResponse.json(
        { message: "Account is deactivated" },
        { status: 401 }
      )
    }

    // For demo purposes, accept any password for existing users
    // In production, you would implement proper password authentication
    console.log('User found, accepting login for demo purposes')

    // Get user role name
    const roles = (await query(
      `SELECT RoleName FROM userroles WHERE RoleID = ?`,
      [user.UserRoleID]
    )) as any[]

    const roleName = roles.length > 0 ? roles[0].RoleName : "Unknown"

    // Create session data (in production, use proper session management)
    const sessionData = {
      userID: user.UserID,
      email: user.Email,
      firstName: user.FirstName,
      lastName: user.LastName,
      roleID: user.UserRoleID,
      roleName: roleName,
      isAuthenticated: true
    }

    // Set session cookie (in production, use secure session management)
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        userID: user.UserID,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
        roleID: user.UserRoleID,
        roleName: roleName
      }
    })

    // Set a simple session cookie (in production, use proper session management)
    response.cookies.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
