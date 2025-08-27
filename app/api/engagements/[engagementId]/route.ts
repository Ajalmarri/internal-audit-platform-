import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ engagementId: string }> }
) {
  try {
    const { engagementId } = await params
    console.log('Single Engagement API called - GET for ID:', engagementId)
    
    // Fetch the main engagement data
    const engagement = await query(
      `SELECT e.EngagementID, e.EngagementTitle, e.Objective, e.Scope, e.StartDate, e.EndDate, 
              es.EngagementStatus, ps.PrimaryStakeholder, u.FirstName, u.LastName,
              e.CreatedDate, e.ModifiedDate
       FROM engagements e
       LEFT JOIN primarystakeholders ps ON ps.PrimaryStakeholderID = e.PrimaryStakeholderID
       LEFT JOIN users u ON u.UserID = e.EngagementManagerID
       LEFT JOIN engagementstatuses es ON es.EngagementStatusID = e.StatusID
       WHERE e.EngagementID = ? AND e.IsDeleted = 0`,
      [engagementId]
    ) as any[]

    if (engagement.length === 0) {
      return NextResponse.json(
        { message: "Engagement not found" },
        { status: 404 }
      )
    }

    const engagementData = engagement[0]
    
    // Fetch related assignments from the new engagementassignments table
    let assignments: any[] = []
    try {
      assignments = await query(
        `SELECT a.AssignmentID, a.AssignmentName, ast.StatusName, a.AssignmentDueDate, a.AssignmentTypeID
         FROM assignments a
         INNER JOIN engagementassignments ea ON a.AssignmentID = ea.AssignmentID
         INNER JOIN assignmentstatuses ast ON a.AssignmentStatusID = ast.StatusID
         WHERE ea.EngagementID = ? AND a.IsDeleted = 0
         ORDER BY a.AssignmentDueDate ASC`,
        [engagementId]
      ) as any[]
      console.log(`Found ${assignments.length} assignments for engagement ${engagementId}`)
    } catch (error) {
      console.warn(`Could not fetch assignments for engagement ${engagementId}:`, error)
      assignments = []
    }

    // Fetch related findings from the updated findings table
    let findings: any[] = []
    try {
      findings = await query(
        `SELECT f.FindingID, f.Title, s.Severity, fs.FindingStatus, f.CreatedDate
         FROM findings f
         LEFT JOIN severities s ON f.SeverityID = s.SeverityID
         LEFT JOIN findingstatuses fs ON f.FindingStatusID = fs.FindingStatusID
         WHERE f.EngagementID = ? AND f.IsDeleted = 0
         ORDER BY f.CreatedDate DESC`,
        [engagementId]
      ) as any[]
      console.log(`Found ${findings.length} findings for engagement ${engagementId}`)
    } catch (error) {
      console.warn(`Could not fetch findings for engagement ${engagementId}:`, error)
      findings = []
    }

    // Fetch related evidence from the new evidence table
    let evidence: any[] = []
    try {
      evidence = await query(
        `SELECT e.EvidenceID, e.EvidenceTitle, e.EvidenceType, e.UploadDate, e.Status
         FROM evidence e
         WHERE e.EngagementID = ? AND e.IsDeleted = 0
         ORDER BY e.UploadDate DESC`,
        [engagementId]
      ) as any[]
      console.log(`Found ${evidence.length} evidence items for engagement ${engagementId}`)
    } catch (error) {
      console.warn(`Could not fetch evidence for engagement ${engagementId}:`, error)
      evidence = []
    }

    // Transform the data to match the expected format
    const transformedEngagement = {
      id: engagementData.EngagementID,
      title: engagementData.EngagementTitle,
      objective: engagementData.Objective,
      scope: engagementData.Scope,
      startDate: engagementData.StartDate ? new Date(engagementData.StartDate).toISOString().split('T')[0] : null,
      endDate: engagementData.EndDate ? new Date(engagementData.EndDate).toISOString().split('T')[0] : null,
      status: engagementData.EngagementStatus,
      stakeholder: engagementData.PrimaryStakeholder,
      manager: `${engagementData.FirstName} ${engagementData.LastName}`,
      createdDate: engagementData.CreatedDate,
      modifiedDate: engagementData.ModifiedDate,
      // Add related data from the new schema
      assignments: assignments.map(a => ({
        id: a.AssignmentID,
        title: a.AssignmentName,
        status: a.StatusName || 'Not Started',
        dueDate: a.AssignmentDueDate ? new Date(a.AssignmentDueDate).toISOString().split('T')[0] : null,
        priority: a.AssignmentTypeID || 'Medium'
      })),
      findings: findings.map(f => ({
        id: f.FindingID,
        title: f.Title,
        severity: f.Severity || 'Medium',
        status: f.FindingStatus || 'Open',
        date: f.CreatedDate ? new Date(f.CreatedDate).toISOString().split('T')[0] : null
      })),
      evidence: evidence.map(e => ({
        id: e.EvidenceID,
        title: e.EvidenceTitle,
        type: e.EvidenceType || 'Document',
        date: e.UploadDate ? new Date(e.UploadDate).toISOString().split('T')[0] : null,
        status: e.Status || 'Pending Review'
      }))
    }

    console.log('Found engagement with real related data:', {
      id: transformedEngagement.id,
      title: transformedEngagement.title,
      assignmentsCount: transformedEngagement.assignments.length,
      findingsCount: transformedEngagement.findings.length,
      evidenceCount: transformedEngagement.evidence.length
    })
    
    return NextResponse.json(transformedEngagement)

  } catch (error) {
    console.error("Single engagement error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
