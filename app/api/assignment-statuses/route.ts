import { NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET() {
  try {
    const assignmentStatuses = await query(`
      SELECT StatusID, StatusName
      FROM assignmentstatuses
      ORDER BY DisplayOrder ASC, StatusName ASC
    `) as any[]

    return NextResponse.json(assignmentStatuses)

  } catch (error) {
    console.error("Assignment statuses error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
