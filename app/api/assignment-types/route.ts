import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const assignmentTypes = await query(`
      SELECT TypeID as AssignmentTypeID, AssignmentType as TypeName
      FROM assignmenttypes
      ORDER BY AssignmentType ASC
    `) as any[]

    return NextResponse.json(assignmentTypes)

  } catch (error) {
    console.error("Assignment types error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
