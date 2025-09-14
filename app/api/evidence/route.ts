import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

interface EvidenceItem {
  id: string
  findingId: string // This will actually be engagementId in the database
  fileName: string
  originalName: string
  fileType: string
  fileSize: number
  filePath: string
  uploadedBy: string
  uploadDate: string
  description?: string
}

interface CreateEvidenceRequest {
  findingId: string // This will actually be engagementId in the database
  fileName: string
  originalName: string
  fileType: string
  fileSize: number
  filePath: string
  uploadedBy: string
  description?: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const findingId = searchParams.get('findingId')
    
    if (!findingId) {
      return NextResponse.json({ message: "Finding ID is required" }, { status: 400 })
    }

    const evidence = await query(
      `SELECT 
         CAST(EvidenceID AS CHAR) AS id,
         CAST(EngagementID AS CHAR) AS findingId,
         FileName AS fileName,
         EvidenceTitle AS originalName,
         FileType AS fileType,
         FileSize AS fileSize,
         FilePath AS filePath,
         CAST(CreatedBy AS CHAR) AS uploadedBy,
         UploadDate AS uploadDate,
         Description AS description
       FROM evidence 
       WHERE EngagementID = ? AND IsDeleted = 0
       ORDER BY UploadDate DESC`,
      [findingId]
    ) as EvidenceItem[]

    return NextResponse.json(evidence)
  } catch (error) {
    console.error("Failed to fetch evidence:", error)
    return NextResponse.json(
      { message: "Failed to fetch evidence" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('Evidence upload request received')
    
    const formData = await request.formData()
    const findingId = formData.get('findingId') as string
    const file = formData.get('file') as File
    const description = formData.get('description') as string
    const uploadedBy = formData.get('uploadedBy') as string || '1' // Default user ID

    console.log('Form data parsed:', { findingId, fileName: file?.name, fileSize: file?.size, fileType: file?.type, uploadedBy })

    if (!findingId || !file) {
      console.log('Missing required fields:', { findingId: !!findingId, file: !!file })
      return NextResponse.json(
        { message: "Finding ID and file are required" },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "File type not allowed" },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'evidence')
    console.log('Upload directory:', uploadDir)
    if (!existsSync(uploadDir)) {
      console.log('Creating upload directory...')
      await mkdir(uploadDir, { recursive: true })
      console.log('Upload directory created')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `evidence_${findingId}_${timestamp}.${fileExtension}`
    const filePath = join(uploadDir, fileName)
    console.log('File path:', filePath)

    // Save file to disk
    console.log('Saving file to disk...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)
    console.log('File saved to disk successfully')

    // Determine evidence type based on file type
    let evidenceType = 'Document'
    if (file.type.startsWith('image/')) {
      evidenceType = 'Image'
    } else if (file.type === 'application/pdf') {
      evidenceType = 'PDF'
    } else if (file.type.includes('word') || file.type.includes('document')) {
      evidenceType = 'Word Document'
    } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      evidenceType = 'Spreadsheet'
    } else if (file.type === 'text/plain') {
      evidenceType = 'Text File'
    }

    // Save evidence record to database
    console.log('Saving evidence record to database...')
    console.log('Evidence type determined:', evidenceType)
    console.log('SQL parameters:', [findingId, file.name, fileName, evidenceType, file.type, file.size, `/uploads/evidence/${fileName}`, description || null, uploadedBy, uploadedBy])

    const result = await query(
      `INSERT INTO evidence (
        EngagementID,
        EvidenceTitle,
        FileName,
        EvidenceType,
        FileType,
        FileSize,
        FilePath,
        Description,
        UploadDate,
        CreatedBy,
        ModifiedBy,
        IsDeleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, 0)`,
      [
        findingId,
        file.name,
        fileName,
        evidenceType,
        file.type,
        file.size,
        `/uploads/evidence/${fileName}`,
        description || null,
        uploadedBy,
        uploadedBy
      ]
    ) as any

    console.log('Database insert result:', result)
    const evidenceId = result.insertId
    console.log('Evidence ID:', evidenceId)

    // Fetch the newly created evidence
    const newEvidence = await query(
      `SELECT 
         CAST(EvidenceID AS CHAR) AS id,
         CAST(EngagementID AS CHAR) AS findingId,
         FileName AS fileName,
         EvidenceTitle AS originalName,
         FileType AS fileType,
         FileSize AS fileSize,
         FilePath AS filePath,
         CAST(CreatedBy AS CHAR) AS uploadedBy,
         UploadDate AS uploadDate,
         Description AS description
       FROM evidence 
       WHERE EvidenceID = ?`,
      [evidenceId]
    ) as EvidenceItem[]

    return NextResponse.json({
      message: "Evidence uploaded successfully",
      evidence: newEvidence[0]
    }, { status: 201 })

  } catch (error) {
    console.error("Failed to upload evidence:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error("Error details:", errorMessage)
    return NextResponse.json(
      { message: `Failed to upload evidence: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const evidenceId = searchParams.get('id')
    
    if (!evidenceId) {
      return NextResponse.json({ message: "Evidence ID is required" }, { status: 400 })
    }

    // Soft delete the evidence
    await query(
      'UPDATE evidence SET IsDeleted = 1, ModifiedDate = NOW() WHERE EvidenceID = ?',
      [evidenceId]
    )

    return NextResponse.json({ message: "Evidence deleted successfully" })
  } catch (error) {
    console.error("Failed to delete evidence:", error)
    return NextResponse.json(
      { message: "Failed to delete evidence" },
      { status: 500 }
    )
  }
}
