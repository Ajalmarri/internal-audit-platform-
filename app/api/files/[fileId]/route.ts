import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// Mock file database - in production, use a real database
const mockFiles = new Map()

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const fileId = params.fileId

    // In production, fetch from database
    const file = mockFiles.get(fileId)

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, file })
  } catch (error) {
    console.error("File fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const fileId = params.fileId

    // In production, fetch from database
    const file = mockFiles.get(fileId)

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Delete from Vercel Blob
    await del(file.url)

    // Remove from mock database
    mockFiles.delete(fileId)

    return NextResponse.json({ success: true, message: "File deleted successfully" })
  } catch (error) {
    console.error("File deletion error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
