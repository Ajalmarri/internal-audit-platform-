import { type NextRequest, NextResponse } from "next/server"
import {
  mockGeneratedReports,
  mockReportTemplates,
  mockBusinessOwnersForReport,
} from "@/app/(main)/reports/_types/report-types"
import { mockFindings } from "@/app/(main)/findings/_types/finding-types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ reportId: string }> }) {
  try {
    const { reportId } = await params

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find the report
    const report = mockGeneratedReports.find((r) => r.id === reportId)

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Get additional details
    const template = mockReportTemplates.find((t) => t.id === report.templateId)
    const targetBusinessOwner = report.targetBusinessOwnerId
      ? mockBusinessOwnersForReport.find((bo) => bo.id === report.targetBusinessOwnerId)
      : null

    // Get included findings details
    const includedFindings = report.includedFindingIds
      .map((id) => mockFindings.find((f) => f.id === id))
      .filter(Boolean)

    const reportDetails = {
      ...report,
      template,
      targetBusinessOwner,
      includedFindings,
      findingsCount: includedFindings.length,
      criticalFindingsCount: includedFindings.filter((f) => f?.severity === "Critical").length,
      highFindingsCount: includedFindings.filter((f) => f?.severity === "High").length,
    }

    return NextResponse.json(reportDetails, { status: 200 })
  } catch (error) {
    console.error("Report details API error:", error)
    return NextResponse.json({ error: "Internal server error while fetching report details" }, { status: 500 })
  }
}
