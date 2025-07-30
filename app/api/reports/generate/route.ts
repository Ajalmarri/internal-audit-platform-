import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { query } from "@/lib/database"
import type { Report } from "@/lib/database"
import {
  mockReportTemplates,
  mockBusinessOwnersForReport,
  mockGeneratedReports,
} from "@/app/(main)/reports/_types/report-types"
import { mockFindings } from "@/app/(main)/findings/_types/finding-types"

// Local file storage configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads"

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

    // Create filename and directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${body.title.replace(/[^a-zA-Z0-9]/g, "_")}_${timestamp}.txt`
    const reportDir = join(UPLOAD_DIR, "reports")
    
    // Create directory if it doesn't exist
    await mkdir(reportDir, { recursive: true })
    
    // Save report to local file system
    const filePath = join(reportDir, filename)
    await writeFile(filePath, reportContent, 'utf8')

    // Generate file URL for local access
    const fileUrl = `/api/files/reports/${filename}`

    // Store report metadata in database
    const reportId = `REP${String(Date.now()).slice(-6)}`
    const now = new Date()

    await query(`
      INSERT INTO reports (id, title, template_id, status, file_path, file_size, generated_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [reportId, body.title, body.templateId, 'finalized', filePath, Buffer.byteLength(reportContent, 'utf8'), body.generatedBy || 'system', now, now])

    // Get the created report record
    const report = await query<Report>(`
      SELECT id, title, template_id, status, file_path, file_size, generated_by, created_at, updated_at
      FROM reports WHERE id = $1
    `, [reportId])

    // Create report record for backward compatibility
    const newReport = {
      id: reportId,
      title: body.title,
      templateId: body.templateId,
      status: "Finalized" as const,
      generatedDate: now.toISOString(),
      filePath: filePath,
      fileUrl: fileUrl,
      downloadUrl: fileUrl,
      targetBusinessOwnerId: body.targetBusinessOwnerId || null,
      dateRange: body.dateRange || null,
      includedFindingIds: body.includedFindingIds || [],
      recipients: body.recipients || [],
      size: Buffer.byteLength(reportContent, 'utf8'),
      version: "v1.0",
    }

    // Add to mock data for backward compatibility
    mockGeneratedReports.push(newReport)

    console.log("Report generated successfully:", newReport)

    return NextResponse.json({
      success: true,
      report: newReport,
      databaseRecord: report[0],
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
    content += `Report Period: ${new Date(data.dateRange.from).toLocaleDateString()} - ${new Date(
      data.dateRange.to,
    ).toLocaleDateString()}

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
