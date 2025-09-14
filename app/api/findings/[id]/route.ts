import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { z } from "zod"

interface RouteParams {
  params: Promise<{ id: string }>
}

// Validation schema for finding updates
const updateFindingSchema = z.object({
  Title: z.string().min(3, "Title must be at least 3 characters"),
  FindingDescription: z.string().nullish(),
  AssignmentID: z.number().int().positive("Assignment ID must be a positive integer"),
  FindingStatusID: z.number().int().positive("Status ID must be a positive integer"),
  SeverityID: z.number().int().positive("Severity ID must be a positive integer"),
  BusinessOwnerID: z.number().int().positive("Business Owner ID must be a positive integer"),
  Recommendation: z.string().nullish(),
  Criteria: z.string().nullish(),
  Impact: z.string().nullish(),
  RootCause: z.string().nullish(),
  ManagementResponse: z.boolean().optional(),
  ManagementComment: z.string().nullish()
})

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ message: "Finding ID is required" }, { status: 400 })
    }

    // Get finding details with basic joins to get human-readable status and severity
    const rows = (await query(
      `SELECT
         CAST(f.FindingID AS CHAR) AS id,
         f.Title AS title,
         f.FindingDescription AS description,
         CAST(f.AssignmentID AS CHAR) AS assignment_id,
         CAST(f.EngagementID AS CHAR) AS engagement_id,
         f.FindingStatusID AS status_id,
         COALESCE(fs.FindingStatus, 'Unknown') AS status,
         f.SeverityID AS severity_id,
         COALESCE(s.Severity, 'Unknown') AS severity,
         CAST(f.BusinessOwnerID AS CHAR) AS business_owner,
         f.CreatedDate AS created_date,
         f.ModifiedDate AS updated_date,
         CAST(f.CreatedBy AS CHAR) AS auditor_in_charge,
         f.Criteria AS criteria,
         f.Impact AS impact,
         f.Recommendation AS recommendations,
         f.RootCause AS cause,
         f.RootCause AS effect,
         f.ManagementComment AS responsible_business_owner,
         f.AttachmentFileName AS attachment_file_name,
         f.AttachmentFileType AS attachment_file_type,
         f.AttachmentFileSize AS attachment_file_size,
         f.ManagementResponse AS management_response,
         COALESCE(a.AssignmentName, CONCAT('Assignment ', CAST(f.AssignmentID AS CHAR))) AS assignment_title,
         COALESCE(ps.PrimaryStakeholder, CONCAT('User ', CAST(f.BusinessOwnerID AS CHAR))) AS business_owner_name,
         COALESCE(ps.PrimaryStakeholder, 'Unknown') AS business_unit
       FROM findings f
       LEFT JOIN findingstatuses fs ON fs.FindingStatusID = f.FindingStatusID
       LEFT JOIN severities s ON s.SeverityID = f.SeverityID
       LEFT JOIN assignments a ON a.AssignmentID = f.AssignmentID
       LEFT JOIN primarystakeholders ps ON ps.PrimaryStakeholderID = f.BusinessOwnerID
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
    
    console.log(`Attempting to delete finding with ID: ${id}`)
    
    // First, check if the finding exists
    const existingFinding = await query(
      'SELECT FindingID FROM findings WHERE FindingID = ? AND IFNULL(IsDeleted, 0) = 0',
      [id]
    ) as any[]
    
    if (existingFinding.length === 0) {
      console.log(`Finding with ID ${id} not found or already deleted`)
      return NextResponse.json({ message: "Finding not found or already deleted" }, { status: 404 })
    }
    
    console.log(`Found finding ${id}, proceeding with soft delete`)
    
    // Soft delete by setting IsDeleted flag instead of hard delete
    const result = await query(
      'UPDATE findings SET IsDeleted = 1, ModifiedDate = NOW() WHERE FindingID = ?', 
      [id]
    )
    
    console.log(`Soft delete result:`, result)
    
    return NextResponse.json({ success: true, message: "Finding deleted successfully" })
  } catch (error) {
    console.error('Failed to delete finding:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to delete finding.', error: message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ message: "Finding ID is required" }, { status: 400 })
    }

    const body = await request.json()
    
    // Validate the request body
    const validationResult = updateFindingSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        message: "Validation failed", 
        errors: validationResult.error.errors 
      }, { status: 400 })
    }

    const validatedData = validationResult.data

    // Check if finding exists
    const existingFinding = await query(
      'SELECT FindingID FROM findings WHERE FindingID = ? AND IFNULL(IsDeleted, 0) = 0',
      [id]
    ) as any[]
    
    if (existingFinding.length === 0) {
      return NextResponse.json({ message: "Finding not found" }, { status: 404 })
    }

    // Update finding with validated data
    const updateQuery = `
      UPDATE findings 
      SET Title = ?,
          FindingDescription = ?,
          AssignmentID = ?,
          FindingStatusID = ?,
          SeverityID = ?,
          BusinessOwnerID = ?,
          Recommendation = ?,
          Criteria = ?,
          Impact = ?,
          RootCause = ?,
          ManagementResponse = ?,
          ManagementComment = ?,
          ModifiedDate = NOW(),
          ModifiedBy = 1
      WHERE FindingID = ? AND IFNULL(IsDeleted, 0) = 0
    `
    
    const updateValues = [
      validatedData.Title,
      validatedData.FindingDescription || null,
      validatedData.AssignmentID,
      validatedData.FindingStatusID,
      validatedData.SeverityID,
      validatedData.BusinessOwnerID,
      validatedData.Recommendation || null,
      validatedData.Criteria || null,
      validatedData.Impact || null,
      validatedData.RootCause || null,
      validatedData.ManagementResponse ? 1 : 0,
      validatedData.ManagementComment || null,
      id
    ]
    
    await query(updateQuery, updateValues)
    
    // Fetch and return the updated finding
    const updatedFinding = await query(
      `SELECT
         CAST(f.FindingID AS CHAR) AS id,
         f.Title AS title,
         f.FindingDescription AS description,
         CAST(f.AssignmentID AS CHAR) AS assignment_id,
         f.FindingStatusID AS status_id,
         COALESCE(fs.FindingStatus, 'Unknown') AS status,
         f.SeverityID AS severity_id,
         COALESCE(s.Severity, 'Unknown') AS severity,
         CAST(f.BusinessOwnerID AS CHAR) AS business_owner,
         f.CreatedDate AS created_date,
         f.ModifiedDate AS updated_date,
         CAST(f.CreatedBy AS CHAR) AS auditor_in_charge,
         f.Criteria AS criteria,
         f.Impact AS impact,
         f.Recommendation AS recommendations,
         f.RootCause AS cause,
         f.RootCause AS effect,
         f.ManagementComment AS responsible_business_owner,
         f.AttachmentFileName AS attachment_file_name,
         f.AttachmentFileType AS attachment_file_type,
         f.AttachmentFileSize AS attachment_file_size,
         f.ManagementResponse AS management_response,
         COALESCE(a.AssignmentName, CONCAT('Assignment ', CAST(f.AssignmentID AS CHAR))) AS assignment_title,
         CONCAT('User ', CAST(f.BusinessOwnerID AS CHAR)) AS business_owner_name
       FROM findings f
       LEFT JOIN findingstatuses fs ON fs.FindingStatusID = f.FindingStatusID
       LEFT JOIN severities s ON s.SeverityID = f.SeverityID
       LEFT JOIN assignments a ON a.AssignmentID = f.AssignmentID
       WHERE f.FindingID = ? AND IFNULL(f.IsDeleted, 0) = 0`,
      [id]
    ) as any[]
    
    if (updatedFinding.length === 0) {
      return NextResponse.json({ message: "Finding not found after update" }, { status: 404 })
    }
    
    return NextResponse.json({ ok: true, finding: updatedFinding[0] })
  } catch (error) {
    console.error('Failed to update finding:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to update finding.', error: message }, { status: 500 })
  }
}





