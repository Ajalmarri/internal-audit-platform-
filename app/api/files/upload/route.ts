import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// WARNING: Hardcoding tokens is a security risk and not recommended for production.
// This should be replaced with a secure way of managing secrets, like environment variables.
// You can get your Blob Read-Write token from your Vercel project settings.
const BLOB_READ_WRITE_TOKEN = "YOUR_BLOB_READ_WRITE_TOKEN_HERE"

export async function POST(request: NextRequest) {
  if (!BLOB_READ_WRITE_TOKEN || BLOB_READ_WRITE_TOKEN === "YOUR_BLOB_READ_WRITE_TOKEN_HERE") {
    console.error("Vercel Blob token is not configured in app/api/files/upload/route.ts.")
    return NextResponse.json(
      { error: "File upload service is not configured. Please update the token in the source code." },
      { status: 500 },
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = (formData.get("category") as string) || "general"
    const entityId = (formData.get("entityId") as string) || "unknown"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
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
    const filename = `${category}/${entityId}/${timestamp}_${sanitizedName}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
      token: BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      success: true,
      file: {
        id: `file_${timestamp}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
        uploadedAt: new Date().toISOString(),
        category,
        entityId,
      },
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
