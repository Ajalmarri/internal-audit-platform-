import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      )
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (error) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      )
    }

    if (!sessionData.isAuthenticated) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        userID: sessionData.userID,
        email: sessionData.email,
        firstName: sessionData.firstName,
        lastName: sessionData.lastName,
        roleID: sessionData.roleID,
        roleName: sessionData.roleName
      }
    })

  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 401 }
    )
  }
}






