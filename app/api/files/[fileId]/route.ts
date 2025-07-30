import { readFile } from "fs/promises"
import { join } from "path"
import { NextRequest, NextResponse } from "next/server"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads"

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId
    
    // Extract category, entityId, and filename from the URL path
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const category = pathParts[4] // /api/files/[category]/[entityId]/[filename]
    const entityId = pathParts[5]
    const filename = pathParts[6]
    
    if (!category || !entityId || !filename) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 })
    }

    const filePath = join(UPLOAD_DIR, category, entityId, filename)
    
    try {
      const fileBuffer = await readFile(filePath)
      
      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase()
      let contentType = 'application/octet-stream'
      
      switch (ext) {
        case 'pdf':
          contentType = 'application/pdf'
          break
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg'
          break
        case 'png':
          contentType = 'image/png'
          break
        case 'gif':
          contentType = 'image/gif'
          break
        case 'txt':
          contentType = 'text/plain'
          break
        case 'csv':
          contentType = 'text/csv'
          break
        case 'doc':
          contentType = 'application/msword'
          break
        case 'docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          break
        case 'xls':
          contentType = 'application/vnd.ms-excel'
          break
        case 'xlsx':
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          break
      }

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
        },
      })
    } catch (error) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("File download error:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
