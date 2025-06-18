import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import {
  mockReportTemplates,
  mockBusinessOwnersForReport,
  mockGeneratedReports,
} from "@/app/(main)/reports/_types/report-types"
import { mockFindings } from "@/app/(main)/findings/_types/finding-types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Report generation request:", body)

    // Validate required fields
    if (!body.title || !body.templateId) {
      return NextResponse.json({ error: "Title and template are required" }, { status: 400 })
    }

    // Validate template exists
    const template = mockReportTemplates.find((t) => t.id === body.templateId)
    if (!template) {
      return NextResponse.json({ error: "Invalid template selected" }, { status: 400 })
    }

    // Validate findings if provided
    if (body.includedFindingIds && body.includedFindingIds.length > 0) {
      const validFindings = body.includedFindingIds.filter((id: string) => mockFindings.some((f) => f.id === id))
      if (validFindings.length !== body.includedFindingIds.length) {
        return NextResponse.json({ error: "Some selected findings are invalid" }, { status: 400 })
      }
    }

    // Validate date range if provided
    if (body.dateRange?.from && body.dateRange?.to) {
      const fromDate = new Date(body.dateRange.from)
      const toDate = new Date(body.dateRange.to)
      if (fromDate >= toDate) {
        return NextResponse.json({ error: "Start date must be before end date" }, { status: 400 })
      }
    }

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate report content
    const reportContent = generateReportContent(body, template)

    // Create filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${body.title.replace(/[^a-zA-Z0-9]/g, "_")}_${timestamp}.txt`

    // Upload to Vercel Blob
    const blob = await put(filename, reportContent, {
      access: "public",
      addRandomSuffix: true,
    })

    // Create report record
    const newReport = {
      id: `REP${String(mockGeneratedReports.length + 1).padStart(3, "0")}`,
      title: body.title,
      templateId: body.templateId,
      status: "Finalized",
      generatedDate: new Date().toISOString(),
      filePath: blob.pathname,
      fileUrl: blob.url,
      downloadUrl: blob.downloadUrl,
      targetBusinessOwnerId: body.targetBusinessOwnerId || null,
      dateRange: body.dateRange || null,
      includedFindingIds: body.includedFindingIds || [],
      recipients: body.recipients || [],
      size: blob.size,
    }

    // Add to mock data (in production, save to database)
    mockGeneratedReports.push(newReport)

    console.log("Report generated successfully:", newReport)

    return NextResponse.json({
      success: true,
      report: newReport,
      message: "Report generated successfully",
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Failed to generate report. Please try again." }, { status: 500 })
  }
}

function generateReportContent(data: any, template: any): string {
  const currentDate = new Date().toLocaleDateString()

  let content = `AUDIT REPORT
================

Title: ${data.title}
Template: ${template.name}
Generated: ${currentDate}

`

  if (data.dateRange) {
    content += `Report Period: ${new Date(data.dateRange.from).toLocaleDateString()} - ${new Date(data.dateRange.to).toLocaleDateString()}

`
  }

  if (data.targetBusinessOwnerId) {
    const businessOwner = mockBusinessOwnersForReport.find((bo) => bo.id === data.targetBusinessOwnerId)
    if (businessOwner) {
      content += `Target Business Owner: ${businessOwner.name}

`
    }
  }

  content += `EXECUTIVE SUMMARY
=================

This report was generated using the ${template.name} template.
${template.description}

`

  if (data.includedFindingIds && data.includedFindingIds.length > 0) {
    content += `FINDINGS SUMMARY
================

Total Findings Included: ${data.includedFindingIds.length}

`

    data.includedFindingIds.forEach((findingId: string, index: number) => {
      const finding = mockFindings.find((f) => f.id === findingId)
      if (finding) {
        content += `${index + 1}. ${finding.title}
   Severity: ${finding.severity}
   Status: ${finding.status}
   Responsible: ${finding.responsibleBusinessOwner}

`
      }
    })
  }

  content += `RECOMMENDATIONS
===============

Based on the findings included in this report, we recommend:

1. Immediate attention to critical and high-severity findings
2. Development of action plans for all identified issues
3. Regular monitoring and follow-up on remediation efforts
4. Implementation of preventive controls to avoid recurrence

CONCLUSION
==========

This report provides a comprehensive overview of the audit findings and recommendations.
Please review the detailed findings and take appropriate action as outlined.

---
Report generated by Internal Audit Platform
Generated on: ${currentDate}
`

  return content
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST to generate reports." }, { status: 405 })
}
