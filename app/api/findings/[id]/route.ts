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

    // Get finding details with basic joins to get human-readable status and severity
    const rows = (await query(
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
    
    // Update finding with provided data
    const updateFields = []
    const updateValues = []
    
    if (body.title !== undefined) {
      updateFields.push('Title = ?')
      updateValues.push(body.title)
    }
    
    if (body.description !== undefined) {
      updateFields.push('FindingDescription = ?')
      updateValues.push(body.description)
    }
    
    if (body.severity !== undefined) {
      updateFields.push('SeverityID = ?')
      updateValues.push(body.severity)
    }
    
    if (body.status !== undefined) {
      updateFields.push('FindingStatusID = ?')
      updateValues.push(body.status)
    }
    
    if (body.assignment_id !== undefined) {
      updateFields.push('AssignmentID = ?')
      updateValues.push(body.assignment_id)
    }
    
    if (body.impact !== undefined) {
      updateFields.push('Impact = ?')
      updateValues.push(body.impact)
    }
    
    if (body.recommendations !== undefined) {
      updateFields.push('Recommendation = ?')
      updateValues.push(body.recommendations)
    }
    
    if (body.criteria !== undefined) {
      updateFields.push('Criteria = ?')
      updateValues.push(body.criteria)
    }
    
    if (body.business_owner !== undefined) {
      updateFields.push('BusinessOwnerID = ?')
      updateValues.push(body.business_owner)
    }
    
    // Always update the modified date
    updateFields.push('ModifiedDate = NOW()')
    
    if (updateFields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 })
    }
    
    const updateQuery = `UPDATE findings SET ${updateFields.join(', ')} WHERE FindingID = ?`
    updateValues.push(id)
    
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
         COALESCE(a.Title, CONCAT('Assignment ', CAST(f.AssignmentID AS CHAR))) AS assignment_title,
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
    
    return NextResponse.json(updatedFinding[0])
  } catch (error) {
    console.error('Failed to update finding:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: 'Failed to update finding.', error: message }, { status: 500 })
  }
}





