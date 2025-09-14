import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg'
]

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB

function sanitizeFilename(filename: string): string {
  // Remove or replace unsafe characters
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { ok: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: `File size exceeds 20MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 413 }
      )
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: `File type not allowed. Allowed types: PDF, DOCX, XLSX, PNG, JPG` },
        { status: 415 }
      )
    }

    // Create temp directory if it doesn't exist
    const tempDir = join(process.cwd(), 'tmp')
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true })
    }

    // Generate safe filename
    const timestamp = Date.now()
    const cleanName = sanitizeFilename(file.name)
    const fileName = `${timestamp}_${cleanName}`
    const tempPath = join(tempDir, fileName)

    // Save file to temp directory
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(tempPath, buffer)

    return NextResponse.json({
      ok: true,
      fileName: file.name,
      size: file.size,
      mime: file.type,
      tempPath: fileName // Return relative path for security
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error during file upload' },
      { status: 500 }
    )
  }
}











