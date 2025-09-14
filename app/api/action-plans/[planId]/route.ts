import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface RouteParams {
  params: { planId: string }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { planId } = await params
    if (!planId) {
      return NextResponse.json({ message: "Action Plan ID is required" }, { status: 400 })
    }

    // Get action plan details with finding information
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
         s.Severity AS priority_name,
         ap.Effort AS effort,
         ap.CreatedDate AS created_date,
         ap.IsApproved AS is_approved,
         ap.Comment AS comment,
         ap.Criteria AS criteria
       FROM actionplans ap
       LEFT JOIN findings f ON ap.FindingID = f.FindingID
       LEFT JOIN severities s ON s.SeverityID = ap.PriorityID
       WHERE ap.ActionPlanID = ? AND IFNULL(ap.IsDeleted, 0) = 0`
    , [planId])) as any[]

    if (rows.length === 0) {
      return NextResponse.json({ message: "Action Plan not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Failed to fetch action plan:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to fetch action plan.', error: message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { planId } = await params
    if (!planId) {
      return NextResponse.json({ message: "Action Plan ID is required" }, { status: 400 })
    }

    // Soft delete the action plan
    await query('UPDATE actionplans SET IsDeleted = 1 WHERE ActionPlanID = ?', [planId])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete action plan:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to delete action plan.', error: message }, { status: 500 })
  }
}
