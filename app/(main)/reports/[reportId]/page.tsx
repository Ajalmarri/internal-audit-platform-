"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Download,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockGeneratedReports, mockReportTemplates, mockBusinessOwnersForReport } from "../_types/report-types"
import { mockFindings } from "../../findings/_types/finding-types"

interface ReportDetails {
  id: string
  title: string
  status: string
  generatedDate: string
  filePath?: string
  fileUrl?: string
  downloadUrl?: string
  template?: {
    id: string
    name: string
    description: string
  }
  targetBusinessOwner?: {
    id: string
    name: string
    type: string
  }
  dateRange?: {
    from: string
    to: string
  }
  includedFindings: Array<{
    id: string
    title: string
    severity: string
    status: string
    responsibleBusinessOwner: string
  }>
  findingsCount: number
  criticalFindingsCount: number
  highFindingsCount: number
  recipients: Array<{
    id: string
    name: string
    email?: string
    type: string
  }>
}

export default function ReportDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string

  const [report, setReport] = useState<ReportDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (reportId) {
      fetchReportDetails()
    }
  }, [reportId])

  const fetchReportDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // For now, use mock data directly since we don't have a separate details API
      // In production, this would be a GET request to /api/reports/[reportId]
      const mockReport = mockGeneratedReports.find((r) => r.id === reportId)

      if (!mockReport) {
        throw new Error("Report not found")
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get additional details
      const template = mockReportTemplates.find((t) => t.id === mockReport.templateId)
      const targetBusinessOwner = mockReport.targetBusinessOwnerId
        ? mockBusinessOwnersForReport.find((bo) => bo.id === mockReport.targetBusinessOwnerId)
        : null

      // Get included findings details
      const includedFindings = mockReport.includedFindingIds
        .map((id) => mockFindings.find((f) => f.id === id))
        .filter(Boolean)

      const reportDetails: ReportDetails = {
        ...mockReport,
        template,
        targetBusinessOwner,
        includedFindings: includedFindings as any[],
        findingsCount: includedFindings.length,
        criticalFindingsCount: includedFindings.filter((f) => f?.severity === "Critical").length,
        highFindingsCount: includedFindings.filter((f) => f?.severity === "High").length,
      }

      setReport(reportDetails)
    } catch (err) {
      console.error("Error fetching report details:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)

      toast({
        title: "Error Loading Report",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!report) return

    try {
      setDownloading(true)

      // If we have a direct download URL from Vercel Blob, use it
      if (report.downloadUrl) {
        const link = document.createElement("a")
        link.href = report.downloadUrl
        link.download = `${report.title}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Download Started",
          description: `${report.title} download has started.`,
        })
      } else {
        throw new Error("Download URL not available")
      }
    } catch (err) {
      console.error("Download error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unable to download the report"

      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/reports">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
            </Link>
          </Button>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error Loading Report:</strong> {error}
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Report</h3>
            <p className="text-muted-foreground text-center mb-4">
              {error || "The requested report could not be found or you don't have permission to view it."}
            </p>
            <div className="flex gap-2">
              <Button onClick={fetchReportDetails} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button onClick={() => router.push("/reports")}>Return to Reports List</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/reports">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{report.title}</h1>
            <p className="text-muted-foreground">Report Details and Summary</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} disabled={downloading || !report.downloadUrl} className="min-w-[120px]">
              {downloading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Report Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <Badge
                      variant={report.status === "Finalized" ? "default" : "secondary"}
                      className={report.status === "Finalized" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Generated Date</div>
                  <p className="mt-1">{new Date(report.generatedDate).toLocaleDateString()}</p>
                </div>
              </div>

              {report.template && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Template Used</div>
                  <p className="mt-1 font-medium">{report.template.name}</p>
                  <p className="text-sm text-muted-foreground">{report.template.description}</p>
                </div>
              )}

              {report.dateRange && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Report Period</div>
                  <p className="mt-1">
                    {new Date(report.dateRange.from).toLocaleDateString()} -{" "}
                    {new Date(report.dateRange.to).toLocaleDateString()}
                  </p>
                </div>
              )}

              {report.targetBusinessOwner && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Target Business Owner</div>
                  <p className="mt-1">{report.targetBusinessOwner.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Included Findings */}
          <Card>
            <CardHeader>
              <CardTitle>Included Findings ({report.findingsCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {report.includedFindings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Finding Title</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responsible Owner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.includedFindings.map((finding) => (
                      <TableRow key={finding.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/findings/${finding.id}`}
                            className="text-primary hover:underline flex items-center"
                          >
                            {finding.title}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              finding.severity === "Critical"
                                ? "destructive"
                                : finding.severity === "High"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {finding.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{finding.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{finding.responsibleBusinessOwner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">No findings included in this report.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Findings</span>
                <span className="font-semibold">{report.findingsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Critical Findings</span>
                <span className="font-semibold text-red-600">{report.criticalFindingsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">High Priority</span>
                <span className="font-semibold text-orange-600">{report.highFindingsCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recipients */}
          {report.recipients && report.recipients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Shared With
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{recipient.name}</p>
                        {recipient.email && <p className="text-xs text-muted-foreground">{recipient.email}</p>}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {recipient.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">File Available</span>
                <div className="flex items-center">
                  {report.downloadUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
              {report.filePath && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">File Path</span>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                    {report.filePath}
                  </span>
                </div>
              )}
              {report.fileUrl && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(report.fileUrl, "_blank")}
                    className="w-full"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View in Browser
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
