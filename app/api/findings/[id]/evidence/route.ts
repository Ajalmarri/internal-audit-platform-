import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { rename, mkdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.png', '.jpg', '.jpeg']

interface CommitEvidenceRequest {
  tempPath: string
  originalName: string
}

// GET: List all evidence documents for a finding
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: findingId } = await params

    // Validate finding exists
    const findingResult = await query(
      'SELECT FindingID FROM FINDINGS WHERE FindingID = ? AND IsDeleted = 0',
      [findingId]
    )

    if (!Array.isArray(findingResult) || findingResult.length === 0) {
      return NextResponse.json(
        { message: 'Finding not found' },
        { status: 404 }
      )
    }

    // Get evidence documents
    const evidence = await query(
      `SELECT 
         DocumentID,
         DocumentName,
         DocumentFileName,
         DocumentFileType,
         DocumentFileSize,
         EngagementID,
         CreatedDate,
         CreatedBy
       FROM DOCUMENTS
       WHERE FindingID = ? AND IsDeleted = 0
       ORDER BY CreatedDate DESC`,
      [findingId]
    )

    return NextResponse.json(evidence)

  } catch (error) {
    console.error('Failed to fetch evidence:', error)
    return NextResponse.json(
      { message: 'Failed to fetch evidence' },
      { status: 500 }
    )
  }
}

// POST: Commit a temp file to this finding
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: findingId } = await params
    const body: CommitEvidenceRequest = await request.json()

    if (!body.tempPath || !body.originalName) {
      return NextResponse.json(
        { message: 'tempPath and originalName are required' },
        { status: 400 }
      )
    }

    // Validate finding exists and get related IDs
    const findingResult = await query(
      'SELECT FindingID, AssignmentID, EngagementID FROM FINDINGS WHERE FindingID = ? AND IsDeleted = 0',
      [findingId]
    )

    if (!Array.isArray(findingResult) || findingResult.length === 0) {
      return NextResponse.json(
        { message: 'Finding not found' },
        { status: 404 }
      )
    }

    const finding = findingResult[0] as any
    const assignmentId = finding.AssignmentID
    const engagementId = finding.EngagementID

    // Validate file extension
    const fileExtension = body.originalName.toLowerCase().substring(body.originalName.lastIndexOf('.'))
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { message: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 415 }
      )
    }

    // Build destination directory
    const tempDir = join(process.cwd(), 'tmp')
    const destDir = join(process.cwd(), 'public', 'uploads', 'findings', findingId)
    
    // Create destination directory if it doesn't exist
    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true })
    }

    // Generate safe filename
    const timestamp = Date.now()
    const sanitizedName = body.originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storedFileName = `${timestamp}_${sanitizedName}`
    
    const tempFilePath = join(tempDir, body.tempPath)
    const destFilePath = join(destDir, storedFileName)

    // Check if temp file exists
    if (!existsSync(tempFilePath)) {
      return NextResponse.json(
        { message: 'Temporary file not found. Please upload again.' },
        { status: 410 }
      )
    }

    // Move file from temp to permanent storage
    await rename(tempFilePath, destFilePath)

    // Get file stats
    const fileStats = await stat(destFilePath)
    const fileSize = fileStats.size

    // Determine file type from extension
    const fileType = getFileTypeFromExtension(fileExtension)

    // Insert document record
    const insertResult = await query(
      `INSERT INTO DOCUMENTS (
        DocumentName,
        DocumentFilePath,
        DocumentFileName,
        DocumentFileType,
        DocumentFileSize,
        AssignmentID,
        FindingID,
        EngagementID,
        CreatedDate,
        CreatedBy,
        ModifiedDate,
        ModifiedBy,
        IsDeleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?, 0)`,
      [
        body.originalName,
        `/uploads/findings/${findingId}/${storedFileName}`,
        storedFileName,
        fileType,
        fileSize,
        assignmentId,
        findingId,
        engagementId,
        1, // CreatedBy - TODO: Get from session
        1  // ModifiedBy - TODO: Get from session
      ]
    )

    // Revalidate the finding page
    revalidatePath(`/findings/${findingId}`)

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Failed to commit evidence:', error)
    return NextResponse.json(
      { message: 'Failed to commit evidence' },
      { status: 500 }
    )
  }
}

// DELETE: Soft delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: findingId } = await params
    const url = new URL(request.url)
    const documentId = url.searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json(
        { message: 'documentId is required' },
        { status: 400 }
      )
    }

    // Validate finding exists
    const findingResult = await query(
      'SELECT FindingID FROM FINDINGS WHERE FindingID = ? AND IsDeleted = 0',
      [findingId]
    )

    if (!Array.isArray(findingResult) || findingResult.length === 0) {
      return NextResponse.json(
        { message: 'Finding not found' },
        { status: 404 }
      )
    }

    // Soft delete the document
    await query(
      'UPDATE DOCUMENTS SET IsDeleted = 1, ModifiedDate = NOW(), ModifiedBy = ? WHERE DocumentID = ? AND FindingID = ?',
      [1, documentId, findingId] // TODO: Get ModifiedBy from session
    )

    // Revalidate the finding page
    revalidatePath(`/findings/${findingId}`)

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Failed to delete evidence:', error)
    return NextResponse.json(
      { message: 'Failed to delete evidence' },
      { status: 500 }
    )
  }
}

// Helper function to determine file type from extension
function getFileTypeFromExtension(extension: string): string {
  const typeMap: { [key: string]: string } = {
    '.pdf': 'PDF Document',
    '.docx': 'Word Document',
    '.xlsx': 'Excel Spreadsheet',
    '.png': 'PNG Image',
    '.jpg': 'JPEG Image',
    '.jpeg': 'JPEG Image'
  }
  
  return typeMap[extension] || 'Unknown File Type'
}
