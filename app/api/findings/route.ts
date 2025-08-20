import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface FindingFromDB {
  id: string
  title: string
  description?: string
  status?: string
  severity?: string
  assignment_id?: string
  created_at?: string
  updated_at?: string
}

export async function GET() {
  try {
    const rows = (await query(
      `SELECT 
         f.findingid::text AS id,
         f.title AS title,
         f.findingdescription AS description,
         fs.findingstatus AS status,
         s.severity AS severity,
         f.assignmentid::text AS assignment_id,
         f.createddate AS created_at,
         f.modifieddate AS updated_at
       FROM findings f
       LEFT JOIN findingstatuses fs ON fs.findingstatusid = f.findingstatusid
       LEFT JOIN severities s ON s.severityid = f.severityid
       WHERE COALESCE(f.isdeleted, false) = false
       ORDER BY f.createddate DESC`,
    )) as FindingFromDB[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch findings from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to fetch findings from database.", error: errorMessage },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const parts = url.pathname.split("/")
    const id = parts[parts.length - 1]
    if (!id || id === "findings") {
      return NextResponse.json({ message: "Finding ID is required" }, { status: 400 })
    }

    await query("UPDATE findings SET isdeleted = true WHERE findingid = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete finding:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ message: "Failed to delete finding.", error: errorMessage }, { status: 500 })
  }
}
