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
    // Get findings with proper column mapping
    const rows = (await query(
      `SELECT 
         CAST(f.FindingID AS CHAR) AS id,
         f.Title AS title,
         f.FindingDescription AS description,
         fs.FindingStatus AS status,
         s.Severity AS severity,
         CAST(f.AssignmentID AS CHAR) AS assignment_id,
         f.CreatedDate AS created_at,
         f.ModifiedDate AS updated_at
       FROM findings f
       LEFT JOIN findingstatuses fs ON fs.FindingStatusID = f.FindingStatusID
       LEFT JOIN severities s ON s.SeverityID = f.SeverityID
       WHERE IFNULL(f.IsDeleted, 0) = 0
       ORDER BY f.CreatedDate DESC`
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
    const parts = url.pathname.split('/')
    const id = parts[parts.length - 1]
    if (!id || id === 'findings') {
      return NextResponse.json({ message: 'Finding ID is required' }, { status: 400 })
    }

    await query('UPDATE findings SET IsDeleted = 1 WHERE FindingID = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete finding:', error)
    let errorMessage = 'An unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ message: 'Failed to delete finding.', error: errorMessage }, { status: 500 })
  }
}
