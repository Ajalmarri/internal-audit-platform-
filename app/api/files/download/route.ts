import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

// GET: Download a file securely
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const findingId = url.searchParams.get('findingId')
    const assignmentId = url.searchParams.get('assignmentId')
    const documentId = url.searchParams.get('documentId')

    if (!documentId && !findingId) {
      return NextResponse.json(
        { message: 'documentId is required (findingId or assignmentId optional)' },
        { status: 400 }
      )
    }

    let documentResult: any[] = []
    if (findingId) {
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

      documentResult = await query(
        `SELECT 
           DocumentID,
           DocumentName,
           DocumentFilePath,
           DocumentFileName,
           DocumentFileType,
           DocumentFileSize
         FROM DOCUMENTS
         WHERE DocumentID = ? AND FindingID = ? AND IsDeleted = 0`,
        [documentId, findingId]
      ) as any[]
    } else if (assignmentId) {
      // Validate assignment exists
      const assignment = await query(
        'SELECT AssignmentID FROM ASSIGNMENTS WHERE AssignmentID = ? AND IsDeleted = 0',
        [assignmentId]
      )
      if (!Array.isArray(assignment) || assignment.length === 0) {
        return NextResponse.json(
          { message: 'Assignment not found' },
          { status: 404 }
        )
      }

      documentResult = await query(
        `SELECT 
           DocumentID,
           DocumentName,
           DocumentFilePath,
           DocumentFileName,
           DocumentFileType,
           DocumentFileSize
         FROM DOCUMENTS
         WHERE DocumentID = ? AND AssignmentID = ? AND IsDeleted = 0`,
        [documentId, assignmentId]
      ) as any[]
    } else {
      // Fallback: by document only (kept for backward compatibility)
      documentResult = await query(
        `SELECT 
           DocumentID,
           DocumentName,
           DocumentFilePath,
           DocumentFileName,
           DocumentFileType,
           DocumentFileSize
         FROM DOCUMENTS
         WHERE DocumentID = ? AND IsDeleted = 0`,
        [documentId]
      ) as any[]
    }

    if (!Array.isArray(documentResult) || documentResult.length === 0) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      )
    }

    const document = documentResult[0] as any

    // Build absolute file path
    const filePath = join(process.cwd(), 'public', document.DocumentFilePath)

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { message: 'File not found on disk' },
        { status: 404 }
      )
    }

    // Read file
    const fileBuffer = await readFile(filePath)

    // Determine content type
    const contentType = getContentTypeFromFileType(document.DocumentFileType)

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${document.DocumentName}"`,
        'Content-Length': document.DocumentFileSize.toString(),
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error('Failed to download file:', error)
    return NextResponse.json(
      { message: 'Failed to download file' },
      { status: 500 }
    )
  }
}

// Helper function to determine content type from file type
function getContentTypeFromFileType(fileType: string): string {
  const typeMap: { [key: string]: string } = {
    'PDF Document': 'application/pdf',
    'Word Document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Excel Spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'PNG Image': 'image/png',
    'JPEG Image': 'image/jpeg',
    'Unknown File Type': 'application/octet-stream'
  }
  
  return typeMap[fileType] || 'application/octet-stream'
}


