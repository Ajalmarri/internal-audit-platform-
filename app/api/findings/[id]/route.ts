import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ message: "Finding ID is required" }, { status: 400 })
    }

    // Get finding details with joins to get human-readable status and severity
    const rows = (await query(
      `SELECT
         CAST(f.FindingID AS CHAR) AS id,
         f.Title AS title,
         f.FindingDescription AS description,
         CAST(f.AssignmentID AS CHAR) AS assignment_id,
         f.FindingStatusID AS status_id,
         fs.FindingStatus AS status,
         f.SeverityID AS severity_id,
         s.Severity AS severity,
         CAST(f.BusinessOwnerID AS CHAR) AS business_owner,
         f.CreatedDate AS created_date,
         f.ModifiedDate AS updated_date,
         CAST(f.CreatedBy AS CHAR) AS auditor_in_charge,
         f.Criteria AS risk_level,
         f.Impact AS impact,
         f.Recommendation AS recommendations
       FROM findings f
       LEFT JOIN findingstatuses fs ON fs.FindingStatusID = f.FindingStatusID
       LEFT JOIN severities s ON s.SeverityID = f.SeverityID
       WHERE f.FindingID = ? AND IFNULL(f.IsDeleted, 0) = 0`
    , [id])) as any[]

    if (rows.length === 0) {
      return NextResponse.json({ message: "Finding not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Failed to fetch finding:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to fetch finding.', error: message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ message: "Finding ID is required" }, { status: 400 })
    }
    await query('DELETE FROM findings WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete finding:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to delete finding.', error: message }, { status: 500 })
  }
}





