import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface RouteParams {
  params: { engagementId: string }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { engagementId } = await params
    if (!engagementId) {
      return NextResponse.json({ message: "Engagement ID is required" }, { status: 400 })
    }

    // Get action plans for findings within this engagement
    const rows = (await query(
      `SELECT
         CAST(ap.ActionPlanID AS CHAR) AS id,
         ap.ActionPlanDescription AS description,
         CAST(ap.ResponsibleID AS CHAR) AS responsible_id,
         ap.DueDate AS due_date,
         ap.ActionPlanStatusID AS status_id,
         CAST(ap.FindingID AS CHAR) AS finding_id,
         f.Title AS finding_title,
         f.FindingDescription AS finding_description,
         ap.Objective AS objective,
         ap.PriorityID AS priority_id,
         ap.Effort AS effort,
         ap.CreatedDate AS created_date,
         ap.IsApproved AS is_approved,
         ap.Comment AS comment,
         ap.Criteria AS criteria,
         ps.PrimaryStakeholder AS business_owner_name,
         aps.ActionPlanStatus AS status_name,
         s.SeverityName AS priority_name
       FROM actionplans ap
       LEFT JOIN findings f ON ap.FindingID = f.FindingID
       LEFT JOIN assignments a ON f.AssignmentID = a.AssignmentID
       LEFT JOIN primarystakeholders ps ON ap.ResponsibleID = ps.PrimaryStakeholderID
       LEFT JOIN actionplanstatuses aps ON ap.ActionPlanStatusID = aps.ActionPlanStatusID
       LEFT JOIN severities s ON ap.PriorityID = s.SeverityID
       WHERE a.EngagementID = ? AND IFNULL(ap.IsDeleted, 0) = 0
       ORDER BY ap.CreatedDate DESC`
    , [engagementId])) as any[]

    console.log(`Found ${rows.length} action plans for engagement ${engagementId}`)

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Failed to fetch action plans for engagement:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to fetch action plans for engagement.', error: message }, { status: 500 })
  }
}



