import { NextResponse } from "next/server"
import { query } from "@/lib/database"

interface FindingFromDB {
  id: string
  title: string
  description?: string
  status?: string
  severity?: string
  assignment_id?: string
  engagement_id?: string
  created_at?: string
  updated_at?: string
  business_unit?: string
  business_owner_id?: string
}

interface CreateFindingRequest {
  title: string
  description?: string
  status?: string
  severity?: string
  assignment_id?: string
  criteria?: string
  condition?: string
  cause?: string
  effect?: string
  recommendation?: string
  responsibleBusinessOwner?: string
  evidenceTempPath?: string
}

// Function to clean up orphaned findings
async function cleanupOrphanedFindings() {
  try {
    // Find and clean up findings that have EngagementID but are no longer linked to valid engagement-assignment relationships
    await query(`
      UPDATE findings f
      SET EngagementID = NULL
      WHERE f.EngagementID IS NOT NULL 
      AND f.IsDeleted = 0
      AND NOT EXISTS (
        SELECT 1 
        FROM engagementassignments ea 
        WHERE ea.EngagementID = f.EngagementID 
        AND ea.AssignmentID = f.AssignmentID 
        AND ea.IsDeleted = 0
      )
    `)
    
    console.log('Orphaned findings cleanup completed')
  } catch (error) {
    console.warn('Could not cleanup orphaned findings:', error)
  }
}

export async function GET() {
  try {
    // Clean up orphaned findings first
    await cleanupOrphanedFindings()
    
    // Get findings with proper column mapping including engagement_id and business unit
    const rows = (await query(
      `SELECT 
         CAST(f.FindingID AS CHAR) AS id,
         f.Title AS title,
         f.FindingDescription AS description,
         fs.FindingStatus AS status,
         s.Severity AS severity,
         CAST(f.AssignmentID AS CHAR) AS assignment_id,
         CAST(f.EngagementID AS CHAR) AS engagement_id,
         f.CreatedDate AS created_at,
         f.ModifiedDate AS updated_at,
         COALESCE(ps.PrimaryStakeholder, 'Unknown') AS business_unit,
         CAST(f.BusinessOwnerID AS CHAR) AS business_owner_id
       FROM findings f
       LEFT JOIN findingstatuses fs ON fs.FindingStatusID = f.FindingStatusID
       LEFT JOIN severities s ON s.SeverityID = f.SeverityID
       LEFT JOIN primarystakeholders ps ON ps.PrimaryStakeholderID = f.BusinessOwnerID
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

export async function POST(request: Request) {
  try {
    const body: CreateFindingRequest = await request.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 })
    }

    // Get default status and severity IDs if not provided
    let statusId = 1 // Default to first status
    let severityId = 1 // Default to first severity
    
    if (body.status) {
      const statusResult = await query('SELECT FindingStatusID FROM findingstatuses WHERE FindingStatus = ?', [body.status])
      if (Array.isArray(statusResult) && statusResult.length > 0) {
        statusId = (statusResult[0] as any).FindingStatusID
      }
    }
    
    if (body.severity) {
      const severityResult = await query('SELECT SeverityID FROM severities WHERE Severity = ?', [body.severity])
      if (Array.isArray(severityResult) && severityResult.length > 0) {
        severityId = (severityResult[0] as any).SeverityID
      }
    }

    // Get default assignment ID if not provided (required field)
    let assignmentId = body.assignment_id
    if (!assignmentId) {
      const assignmentResult = await query('SELECT AssignmentID FROM assignments LIMIT 1')
      assignmentId = Array.isArray(assignmentResult) && assignmentResult.length > 0 ? (assignmentResult[0] as any).AssignmentID : 1
    }

    // Get the engagement ID for this assignment
    let engagementId = null
    try {
      const engagementResult = await query(
        'SELECT EngagementID FROM engagementassignments WHERE AssignmentID = ? AND IsDeleted = 0',
        [assignmentId]
      ) as any[]
      if (Array.isArray(engagementResult) && engagementResult.length > 0) {
        engagementId = (engagementResult[0] as any).EngagementID
      }
    } catch (error) {
      console.warn('Could not find engagement for assignment:', assignmentId, error)
    }

    // Get default business owner ID (required field)
    const businessOwnerResult = await query('SELECT PrimaryStakeholderID FROM primarystakeholders LIMIT 1')
    const businessOwnerId = Array.isArray(businessOwnerResult) && businessOwnerResult.length > 0 ? (businessOwnerResult[0] as any).PrimaryStakeholderID : 1

    // Get default user ID (required field)
    const userResult = await query('SELECT UserID FROM users LIMIT 1')
    const userId = Array.isArray(userResult) && userResult.length > 0 ? (userResult[0] as any).UserID : 1

    // Insert new finding using the correct schema with EngagementID
    const result = await query(
      `INSERT INTO findings (
        Title, 
        FindingDescription, 
        AssignmentID,
        EngagementID,
        FindingStatusID, 
        SeverityID, 
        BusinessOwnerID,
        Recommendation,
        Criteria,
        Impact,
        RootCause,
        CreatedDate,
        ModifiedDate,
        CreatedBy,
        ModifiedBy,
        IsDeleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 0)`,
      [
        body.title,
        body.description || '',
        assignmentId,
        engagementId,
        statusId,
        severityId,
        businessOwnerId,
        body.recommendation || '',
        body.criteria || '',
        body.effect || '', // Map effect to Impact column
        body.cause || '', // Map cause to RootCause column
        userId, // CreatedBy
        userId, // ModifiedBy
      ]
    )

    const insertResult = result as any
    const newFindingId = insertResult.insertId

    // Handle evidence file if provided
    if (body.evidenceTempPath) {
      try {
        const { rename } = await import('fs/promises')
        const { join } = await import('path')
        
        const tempDir = join(process.cwd(), 'tmp')
        const permanentDir = join(process.cwd(), 'public', 'uploads', 'evidence')
        
        // Create permanent directory if it doesn't exist
        const { mkdir } = await import('fs/promises')
        await mkdir(permanentDir, { recursive: true })
        
        const tempFilePath = join(tempDir, body.evidenceTempPath)
        const permanentFilePath = join(permanentDir, body.evidenceTempPath)
        
        // Move file from temp to permanent storage
        await rename(tempFilePath, permanentFilePath)
        
        // TODO: Later integrate with SharePoint/S3 for cloud storage
        console.log(`Evidence file moved from temp to permanent storage: ${body.evidenceTempPath}`)
        
      } catch (error) {
        console.warn('Could not move evidence file to permanent storage:', error)
        // Don't fail the finding creation if file move fails
      }
    }

    // Fetch the newly created finding
    const newFinding = await query(
      `SELECT 
         CAST(f.FindingID AS CHAR) AS id,
         f.Title AS title,
         f.FindingDescription AS description,
         fs.FindingStatus AS status,
         s.Severity AS severity,
         CAST(f.AssignmentID AS CHAR) AS assignment_id,
         CAST(f.EngagementID AS CHAR) AS engagement_id,
         f.CreatedDate AS created_at,
         f.ModifiedDate AS updated_at
       FROM findings f
       LEFT JOIN findingstatuses fs ON fs.FindingStatusID = f.FindingStatusID
       LEFT JOIN severities s ON s.SeverityID = f.SeverityID
       WHERE f.FindingID = ?`,
      [newFindingId]
    )

    // Get engagement details for the response
    let engagementInfo = null
    if (engagementId) {
      try {
        const engagementResult = await query(
          'SELECT EngagementTitle FROM engagements WHERE EngagementID = ?',
          [engagementId]
        ) as any[]
        if (Array.isArray(engagementResult) && engagementResult.length > 0) {
          engagementInfo = {
            id: engagementId,
            title: engagementResult[0].EngagementTitle
          }
        }
      } catch (error) {
        console.warn('Could not fetch engagement details:', error)
      }
    }

    return NextResponse.json({
      message: "Finding created successfully",
      finding: Array.isArray(newFinding) ? newFinding[0] : newFinding,
      engagement: engagementInfo
    }, { status: 201 })

  } catch (error) {
    console.error("Failed to create finding:", error)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: "Failed to create finding.", error: errorMessage },
      { status: 500 }
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

