import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { mkdir, rename, stat } from 'fs/promises'
import { existsSync } from 'fs'
import { basename, join } from 'path'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

interface CommitDocumentRequest {
  tempPath: string
  originalName: string
  mime?: string
  size?: number
}

// GET: List documents for an assignment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params

    // Validate assignment exists
    const assignment = await query(
      'SELECT AssignmentID FROM ASSIGNMENTS WHERE AssignmentID = ? AND IsDeleted = 0',
      [assignmentId]
    ) as any[]

    if (!Array.isArray(assignment) || assignment.length === 0) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 })
    }

    const rows = await query(
      `SELECT 
         DocumentID,
         DocumentName,
         DocumentFileName,
         DocumentFileType,
         DocumentFileSize,
         CreatedDate
       FROM DOCUMENTS 
       WHERE AssignmentID = ? AND IsDeleted = 0 
       ORDER BY CreatedDate DESC`,
      [assignmentId]
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Failed to fetch assignment documents:', error)
    return NextResponse.json({ message: 'Failed to fetch documents' }, { status: 500 })
  }
}

// POST: Commit a temp upload as an assignment document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const body: CommitDocumentRequest = await request.json()

    if (!body?.tempPath || !body?.originalName) {
      return NextResponse.json(
        { message: 'tempPath and originalName are required' },
        { status: 400 }
      )
    }

    // Verify assignment exists
    const assignment = await query(
      'SELECT AssignmentID FROM ASSIGNMENTS WHERE AssignmentID = ? AND IsDeleted = 0',
      [assignmentId]
    ) as any[]

    if (!Array.isArray(assignment) || assignment.length === 0) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 })
    }

    // Optional engagement lookup
    const engagementResult = await query(
      'SELECT EngagementID FROM ENGAGEMENTS WHERE AssignmentID = ? AND IsDeleted = 0 LIMIT 1',
      [assignmentId]
    ) as any[]
    const engagementId = engagementResult?.[0]?.EngagementID || null

    // Paths
    const tempDir = join(process.cwd(), 'tmp')
    const destDir = join(process.cwd(), 'public', 'uploads', 'assignments', assignmentId)

    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true })
    }

    // Ensure we only use a basename to prevent path traversal
    const tempName = basename(body.tempPath)
    const tempFilePath = join(tempDir, tempName)

    if (!tempFilePath.startsWith(tempDir)) {
      return NextResponse.json({ message: 'Invalid temp path' }, { status: 400 })
    }

    // Generate safe server filename
    const sanitizedOriginal = body.originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storedFileName = `${Date.now()}_${sanitizedOriginal}`
    const destFilePath = join(destDir, storedFileName)

    if (!existsSync(tempFilePath)) {
      return NextResponse.json(
        { message: 'Temporary file not found. Please upload again.' },
        { status: 410 }
      )
    }

    // Move file
    await rename(tempFilePath, destFilePath)

    // Get final file size
    const fileStats = await stat(destFilePath)
    const fileSize = fileStats.size

    // Determine file type label
    const fileType = getFileTypeFromName(sanitizedOriginal)

    const userId = 1 // TODO: derive from auth/session

    await query(
      `INSERT INTO DOCUMENTS (
        DocumentName,
        DocumentFilePath,
        DocumentFileName,
        DocumentFileType,
        DocumentFileSize,
        AssignmentID,
        EngagementID,
        CreatedDate,
        CreatedBy,
        ModifiedDate,
        ModifiedBy,
        IsDeleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?, 0)`,
      [
        body.originalName,
        `/uploads/assignments/${assignmentId}/${storedFileName}`,
        storedFileName,
        fileType,
        fileSize,
        assignmentId,
        engagementId,
        userId,
        userId
      ]
    )

    revalidatePath(`/assignments/${assignmentId}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to commit assignment document:', error)
    return NextResponse.json({ message: 'Failed to save document' }, { status: 500 })
  }
}

// DELETE: Soft delete a document from an assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params
    const url = new URL(request.url)
    const documentId = url.searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json({ message: 'documentId is required' }, { status: 400 })
    }

    // Validate assignment exists
    const assignment = await query(
      'SELECT AssignmentID FROM ASSIGNMENTS WHERE AssignmentID = ? AND IsDeleted = 0',
      [assignmentId]
    ) as any[]

    if (!Array.isArray(assignment) || assignment.length === 0) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 })
    }

    const userId = 1 // TODO: derive from session

    await query(
      `UPDATE DOCUMENTS 
       SET IsDeleted = 1, ModifiedDate = NOW(), ModifiedBy = ?
       WHERE DocumentID = ? AND AssignmentID = ?`,
      [userId, documentId, assignmentId]
    )

    revalidatePath(`/assignments/${assignmentId}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete assignment document:', error)
    return NextResponse.json({ message: 'Failed to delete document' }, { status: 500 })
  }
}

function getFileTypeFromName(fileName: string): string {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.pdf')) return 'PDF Document'
  if (lower.endsWith('.docx')) return 'Word Document'
  if (lower.endsWith('.xlsx')) return 'Excel Spreadsheet'
  if (lower.endsWith('.png')) return 'PNG Image'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'JPEG Image'
  return 'Unknown File Type'
}




