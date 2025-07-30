import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import type { Evidence } from "@/lib/database"

// Local file storage configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads"
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = (formData.get("category") as string) || "general"
    const entityId = (formData.get("entityId") as string) || "unknown"
    const title = (formData.get("title") as string) || file.name
    const description = (formData.get("description") as string) || ""
    const assignmentId = (formData.get("assignmentId") as string) || null
    const findingId = (formData.get("findingId") as string) || null
    const uploadedBy = (formData.get("uploadedBy") as string) || "system"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/gif",
      "text/plain",
      "text/csv",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not supported" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${sanitizedName}`
    
    // Create directory structure
    const uploadPath = join(UPLOAD_DIR, category, entityId)
    await mkdir(uploadPath, { recursive: true })
    
    // Save file locally
    const filePath = join(uploadPath, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Generate file URL for local access
    const fileUrl = `/api/files/${category}/${entityId}/${filename}`

    // Store file metadata in database
    const evidenceId = `EV${String(timestamp).slice(-6)}`
    const now = new Date()

    await query(`
      INSERT INTO evidence (id, title, description, file_path, file_size, file_type, assignment_id, finding_id, uploaded_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [evidenceId, title, description, filePath, file.size, file.type, assignmentId, findingId, uploadedBy, now])

    // Get the created evidence record
    const evidence = await query<Evidence>(`
      SELECT id, title, description, file_path, file_size, file_type, assignment_id, finding_id, uploaded_by, created_at
      FROM evidence WHERE id = $1
    `, [evidenceId])

    return NextResponse.json({
      success: true,
      evidence: evidence[0],
      file: {
        id: evidenceId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        downloadUrl: fileUrl,
        pathname: filePath,
        uploadedAt: now.toISOString(),
        category,
        entityId,
      },
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
