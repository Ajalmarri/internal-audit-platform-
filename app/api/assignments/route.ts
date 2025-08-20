import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface AssignmentFromDB {
  id: string
  title: string
  description?: string
  status?: string
  audit_plan_id?: string
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
}

interface CreateAssignmentRequest {
  title: string
  description?: string
  status?: string
  audit_plan_id?: string
  start_date?: string
  end_date?: string
  risk_likelihood?: string
  impact?: string
  inherent_risk?: string
  tasks?: Array<{
    description: string
    assigneeId?: string
    dueDate?: string
    status?: string
  }>
  risks?: Array<{
    riskId?: string
    controlId?: string
    assessment?: string
  }>
}

export async function GET() {
  try {
    // Get assignments with proper column mapping
    const rows = (await query(
      `SELECT 
         CAST(a.AssignmentID AS CHAR) AS id,
         a.AssignmentName AS title,
         a.AssignmentDescription AS description,
         ast.StatusName AS status,
         CAST(a.PlanID AS CHAR) AS audit_plan_id,
         a.CreatedDate AS created_at,
         a.ModifiedDate AS updated_at,
         a.AssignmentDueDate AS end_date,
         a.AssignmentStartDate AS start_date
       FROM assignments a
       LEFT JOIN assignmentstatuses ast ON ast.StatusID = a.AssignmentStatusID
       WHERE IFNULL(a.IsDeleted, 0) = 0
       ORDER BY a.CreatedDate DESC`
    )) as AssignmentFromDB[]

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch assignments from database:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to fetch assignments from database.", error: errorMessage },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateAssignmentRequest = await request.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 })
    }

    // Get default status ID if not provided
    let statusId = 1 // Default to first status
    
    if (body.status) {
      const statusResult = await query('SELECT StatusID FROM assignmentstatuses WHERE StatusName = ?', [body.status])
      if (Array.isArray(statusResult) && statusResult.length > 0) {
        statusId = (statusResult[0] as any).StatusID
      }
    }

    // Get default type ID (required field)
    const typeResult = await query('SELECT TypeID FROM assignmenttypes LIMIT 1')
    const typeId = Array.isArray(typeResult) && typeResult.length > 0 ? (typeResult[0] as any).TypeID : 1

    // Get default user ID for assignee (required field)
    const userResult = await query('SELECT UserID FROM users LIMIT 1')
    const userId = Array.isArray(userResult) && userResult.length > 0 ? (userResult[0] as any).UserID : 1

    // Get risk IDs (required fields)
    const riskLikelihoodResult = await query('SELECT LikelihoodID FROM risklikelihoods WHERE Likelihood = ?', [body.risk_likelihood || 'Medium'])
    const riskLikelihoodId = Array.isArray(riskLikelihoodResult) && riskLikelihoodResult.length > 0 ? (riskLikelihoodResult[0] as any).LikelihoodID : 1

    const riskImpactResult = await query('SELECT ImpactID FROM riskimpacts WHERE Impact = ?', [body.impact || 'Medium'])
    const riskImpactId = Array.isArray(riskImpactResult) && riskImpactResult.length > 0 ? (riskImpactResult[0] as any).ImpactID : 1

    const inherentRiskResult = await query('SELECT InherentRiskID FROM inherentrisks WHERE InherentRisk = ?', [body.inherent_risk || 'Medium'])
    const inherentRiskId = Array.isArray(inherentRiskResult) && inherentRiskResult.length > 0 ? (inherentRiskResult[0] as any).InherentRiskID : 1

    // Insert new assignment using the correct schema
    const result = await query(
      `INSERT INTO assignments (
        AssignmentName, 
        AssignmentDescription,
        AssignmentStatusID, 
        AssignmentTypeID,
        AssignmentStartDate,
        AssignmentDueDate,
        AssigneeID,
        PlanID,
        RiskLikelihoodID,
        RiskImpactID,
        InherentRiskID,
        CreatedDate,
        ModifiedDate,
        CreatedBy,
        ModifiedBy,
        IsDeleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
      [
        body.title,
        body.description || null,
        statusId,
        typeId,
        body.start_date || null,
        body.end_date || null,
        userId,
        body.audit_plan_id || null,
        riskLikelihoodId,
        riskImpactId,
        inherentRiskId,
        userId, // CreatedBy
        userId, // ModifiedBy
      ]
    )

    const insertResult = result as any
    const newAssignmentId = insertResult.insertId

    // Create tasks if provided
    if (body.tasks && body.tasks.length > 0) {
      for (const task of body.tasks) {
        // Get status ID for the task
        const taskStatusResult = await query(
          'SELECT StatusID FROM audittaskstatuses WHERE StatusName = ? LIMIT 1',
          [task.status || 'Pending']
        )
        const taskStatusId = Array.isArray(taskStatusResult) && taskStatusResult.length > 0 
          ? (taskStatusResult[0] as any).StatusID 
          : 1

        // Insert the task
        await query(
          `INSERT INTO audittasks (
            AuditTaskDescription,
            StatusID,
            AssigneeID,
            AssignmentID,
            DueDate,
            CreatedDate,
            ModifiedDate,
            CreatedBy,
            ModifiedBy,
            IsDeleted
          ) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
          [
            task.description,
            taskStatusId,
            task.assigneeId || userId,
            newAssignmentId,
            task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 19).replace('T', ' ') : null,
            userId,
            userId
          ]
        )
      }
    }

    // Create risk-control relationships if provided
    if (body.risks && body.risks.length > 0) {
      for (const risk of body.risks) {
        // Skip mock data with string IDs (like "RISK001")
        if (typeof risk.riskId === 'string' && risk.riskId.startsWith('RISK')) {
          console.log('Skipping mock risk:', risk.riskId)
          continue
        }
        if (typeof risk.controlId === 'string' && risk.controlId.startsWith('CONTROL')) {
          console.log('Skipping mock control:', risk.controlId)
          continue
        }

        // Only insert if we have valid numeric IDs
        const riskId = parseInt(risk.riskId || '1') || 1
        const controlId = parseInt(risk.controlId || '1') || 1

        // Insert risk-control assignment
        await query(
          `INSERT INTO assignmentriskcontrols (
            AssignmentID,
            RiskID,
            ControlID,
            Assessment,
            CreatedDate,
            ModifiedDate,
            CreatedBy,
            ModifiedBy,
            IsDeleted
          ) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
          [
            newAssignmentId,
            riskId,
            controlId,
            risk.assessment || 'Effective',
            userId,
            userId
          ]
        )
      }
    }

    // Fetch the newly created assignment
    const newAssignment = await query(
      `SELECT 
         CAST(a.AssignmentID AS CHAR) AS id,
         a.AssignmentName AS title,
         a.AssignmentDescription AS description,
         ast.StatusName AS status,
         CAST(a.PlanID AS CHAR) AS audit_plan_id,
         a.CreatedDate AS created_at,
         a.ModifiedDate AS updated_at,
         a.AssignmentDueDate AS end_date,
         a.AssignmentStartDate AS start_date
       FROM assignments a
       LEFT JOIN assignmentstatuses ast ON ast.StatusID = a.AssignmentStatusID
       WHERE a.AssignmentID = ?`,
      [newAssignmentId]
    )

    return NextResponse.json({
      message: "Assignment created successfully",
      assignment: Array.isArray(newAssignment) ? newAssignment[0] : newAssignment
    }, { status: 201 })

  } catch (error) {
    console.error("Failed to create assignment:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to create assignment.", error: errorMessage },
      { status: 500 }
    )
  }
}
