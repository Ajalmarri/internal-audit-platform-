import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const mockGeneratedReports = new Map()

export async function GET(request: NextRequest, { params }: { params: { reportId: string } }) {
  try {
    const reportId = params.reportId

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 })
    }

    // In production, fetch from database
    // For demo, we'll create a mock report with Vercel Blob URL
    const mockReport = {
      id: reportId,
      title: "Sample Audit Report",
      filePath: `/reports/${reportId}/sample_report.txt`,
      fileUrl: `https://your-blob-url.vercel-storage.com/reports/${reportId}/sample_report.txt`,
      downloadUrl: `https://your-blob-url.vercel-storage.com/reports/${reportId}/sample_report.txt`,
      fileName: "sample_report.txt",
    }

    if (!mockReport.fileUrl) {
      return NextResponse.json({ error: "Report file not available" }, { status: 404 })
    }

    // Return the direct download URL from Vercel Blob
    return NextResponse.json({
      success: true,
      filename: mockReport.fileName,
      downloadUrl: mockReport.downloadUrl,
      fileUrl: mockReport.fileUrl,
      message: "Download ready",
    })
  } catch (error) {
    console.error("Download API error:", error)
    return NextResponse.json({ error: "Internal server error during download preparation" }, { status: 500 })
  }
}
