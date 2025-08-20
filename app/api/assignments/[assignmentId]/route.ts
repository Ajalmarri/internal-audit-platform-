import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

interface RouteParams {
  params: Promise<{ assignmentId: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { assignmentId } = await params
    
    const assignment = await query(
      `SELECT 
         CAST(a.AssignmentID AS CHAR) AS AssignmentID,
         a.AssignmentName AS AssignmentName,
         a.AssignmentDescription AS AssignmentDescription,
         ast.StatusName AS StatusName,
         CAST(a.PlanID AS CHAR) AS PlanID,
         a.CreatedDate AS CreatedDate,
         a.ModifiedDate AS ModifiedDate,
         a.AssignmentDueDate AS AssignmentDueDate,
         a.AssignmentStartDate AS AssignmentStartDate,
         at.AssignmentType AS AssignmentTypeName,
         rl.Likelihood AS RiskLikelihoodName,
         ri.Impact AS RiskImpactName,
         ir.InherentRisk AS InherentRiskName
       FROM assignments a
       LEFT JOIN assignmentstatuses ast ON ast.StatusID = a.AssignmentStatusID
       LEFT JOIN assignmenttypes at ON at.TypeID = a.AssignmentTypeID
       LEFT JOIN risklikelihoods rl ON rl.LikelihoodID = a.RiskLikelihoodID
       LEFT JOIN riskimpacts ri ON ri.ImpactID = a.RiskImpactID
       LEFT JOIN inherentrisks ir ON ir.InherentRiskID = a.InherentRiskID
       WHERE a.AssignmentID = ? AND a.IsDeleted = 0`,
      [assignmentId]
    )

    if (!assignment || (Array.isArray(assignment) && assignment.length === 0)) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json(
      Array.isArray(assignment) ? assignment[0] : assignment
    )
  } catch (error) {
    console.error("Failed to fetch assignment:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to fetch assignment.", error: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { assignmentId } = await params
    
    // First check if the assignment exists
    const existingAssignment = await query(
      'SELECT AssignmentID FROM assignments WHERE AssignmentID = ? AND IsDeleted = 0',
      [assignmentId]
    )

    if (!existingAssignment || (Array.isArray(existingAssignment) && existingAssignment.length === 0)) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 })
    }

    // Soft delete by setting IsDeleted = 1
    await query(
      'UPDATE assignments SET IsDeleted = 1, ModifiedDate = NOW() WHERE AssignmentID = ?',
      [assignmentId]
    )

    return NextResponse.json({ message: "Assignment deleted successfully" })
  } catch (error) {
    console.error("Failed to delete assignment:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to delete assignment.", error: errorMessage },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { assignmentId } = await params
    const body = await request.json()
    
    // First check if the assignment exists
    const existingAssignment = await query(
      'SELECT AssignmentID FROM assignments WHERE AssignmentID = ? AND IsDeleted = 0',
      [assignmentId]
    )

    if (!existingAssignment || (Array.isArray(existingAssignment) && existingAssignment.length === 0)) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 })
    }

    // Update the assignment
    const updateFields = []
    const updateValues = []
    
    if (body.title !== undefined) {
      updateFields.push('AssignmentName = ?')
      updateValues.push(body.title)
    }
    
    if (body.description !== undefined) {
      updateFields.push('AssignmentDescription = ?')
      updateValues.push(body.description)
    }
    
    if (body.status !== undefined) {
      // Get status ID from status name
      const statusResult = await query('SELECT StatusID FROM assignmentstatuses WHERE StatusName = ?', [body.status])
      if (Array.isArray(statusResult) && statusResult.length > 0) {
        updateFields.push('AssignmentStatusID = ?')
        updateValues.push((statusResult[0] as any).StatusID)
      }
    }
    
    if (body.end_date !== undefined) {
      updateFields.push('AssignmentDueDate = ?')
      updateValues.push(body.end_date)
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 })
    }
    
    updateFields.push('ModifiedDate = NOW()')
    updateValues.push(assignmentId)
    
    await query(
      `UPDATE assignments SET ${updateFields.join(', ')} WHERE AssignmentID = ?`,
      updateValues
    )

    // Fetch the updated assignment
    const updatedAssignment = await query(
      `SELECT 
         CAST(a.AssignmentID AS CHAR) AS AssignmentID,
         a.AssignmentName AS AssignmentName,
         a.AssignmentDescription AS AssignmentDescription,
         ast.StatusName AS StatusName,
         CAST(a.PlanID AS CHAR) AS PlanID,
         a.CreatedDate AS CreatedDate,
         a.ModifiedDate AS ModifiedDate,
         a.AssignmentDueDate AS AssignmentDueDate,
         a.AssignmentStartDate AS AssignmentStartDate,
         at.AssignmentType AS AssignmentTypeName,
         rl.Likelihood AS RiskLikelihoodName,
         ri.Impact AS RiskImpactName,
         ir.InherentRisk AS InherentRiskName
       FROM assignments a
       LEFT JOIN assignmentstatuses ast ON ast.StatusID = a.AssignmentStatusID
       LEFT JOIN assignmenttypes at ON at.TypeID = a.AssignmentTypeID
       LEFT JOIN risklikelihoods rl ON rl.LikelihoodID = a.RiskLikelihoodID
       LEFT JOIN riskimpacts ri ON ri.ImpactID = a.RiskImpactID
       LEFT JOIN inherentrisks ir ON ir.InherentRiskID = a.InherentRiskID
       WHERE a.AssignmentID = ?`,
      [assignmentId]
    )

    return NextResponse.json({
      message: "Assignment updated successfully",
      assignment: Array.isArray(updatedAssignment) ? updatedAssignment[0] : updatedAssignment
    })
  } catch (error) {
    console.error("Failed to update assignment:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to update assignment.", error: errorMessage },
      { status: 500 }
    )
  }
}
