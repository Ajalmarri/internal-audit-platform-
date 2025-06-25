"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Download,
  Eye,
  FilePlus2,
  MoreHorizontal,
  Trash2,
  Edit,
  AlertCircle,
  Share2,
  History,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

import type { GeneratedReport, ShareDetailsPayload, ReportStatus } from "./_types/report-types"
import { mockGeneratedReports, mockReportTemplates } from "./_types/report-types"
import { useRouter } from "next/navigation"
import { ShareReportModal } from "./_components/share-report-modal"

export default function ReportsPage() {
  const [reports, setReports] = useState<GeneratedReport[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingReports, setDownloadingReports] = useState<Set<string>>(new Set())
  const router = useRouter()

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [reportToShare, setReportToShare] = useState<GeneratedReport | null>(null)

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 500))
        setReports(mockGeneratedReports)
      } catch (error) {
        console.error("Error loading reports:", error)
        toast({
          title: "Error",
          description: "Failed to load reports. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  const handleViewDetails = (reportId: string) => {
    router.push(`/reports/${reportId}`)
  }

  const handleViewVersionHistory = (reportId: string) => {
    console.log(`Viewing version history for report: ${reportId}`)
    toast({
      title: "Feature Not Implemented",
      description: `Version history for report ${reportId} would be shown here.`,
    })
  }

  const handleApproveReport = (reportId: string) => {
    console.log(`Approving report: ${reportId}`)
    setReports((prevReports) => prevReports.map((r) => (r.id === reportId ? { ...r, status: "Finalized" } : r)))
    toast({
      title: "Report Approved",
      description: `Report ${reportId} has been approved and finalized.`,
    })
  }

  const handleRequestChanges = (reportId: string) => {
    console.log(`Requesting changes for report: ${reportId}`)
    setReports(
      (prevReports) => prevReports.map((r) => (r.id === reportId ? { ...r, status: "Draft" } : r)), // Example: revert to Draft
    )
    toast({
      title: "Changes Requested",
      description: `Changes have been requested for report ${reportId}. It has been moved back to Draft.`,
      variant: "default",
    })
  }

  const getStatusBadgeVariant = (status: ReportStatus) => {
    switch (status) {
      case "Finalized":
        return "default" // Greenish
      case "Awaiting Approval":
        return "outline" // Yellowish/Orangeish - using outline for now
      case "Draft":
        return "secondary" // Greyish
      case "Archived":
        return "destructive" // Reddish (if needed, or another color)
      default:
        return "secondary"
    }
  }

  const getStatusBadgeClassName = (status: ReportStatus) => {
    switch (status) {
      case "Finalized":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "Awaiting Approval":
        return "bg-yellow-400 hover:bg-yellow-500 text-black"
      case "Draft":
        return "" // Default secondary styling
      case "Archived":
        return "bg-slate-500 hover:bg-slate-600 text-white"
      default:
        return ""
    }
  }

  const handleDownloadPdf = async (report: GeneratedReport) => {
    if (!report.filePath) {
      toast({
        title: "File Not Available",
        description: "This report doesn't have an associated file for download.",
        variant: "destructive",
      })
      return
    }
    try {
      setDownloadingReports((prev) => new Set(prev).add(report.id))
      const response = await fetch(`/api/reports/${report.id}/download`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Download failed")
      }
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Download Started",
          description: `${data.filename} download has been initiated.`,
        })
        console.log("Download URL:", data.downloadUrl)
        setTimeout(() => {
          toast({
            title: "Download Complete",
            description: `${data.filename} has been downloaded successfully.`,
          })
        }, 2000)
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Unable to download the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadingReports((prev) => {
        const newSet = new Set(prev)
        newSet.delete(report.id)
        return newSet
      })
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    try {
      setReports(reports.filter((r) => r.id !== reportId))
      toast({
        title: "Report Deleted",
        description: "The report has been successfully deleted.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete Failed",
        description: "Unable to delete the report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditDraft = (reportId: string) => {
    router.push(`/reports/generate?edit=${reportId}`)
  }

  const handleOpenShareModal = (report: GeneratedReport) => {
    setReportToShare(report)
    setIsShareModalOpen(true)
  }

  const handleShareReport = (shareDetails: ShareDetailsPayload) => {
    console.log("Sharing report:", shareDetails)
    toast({
      title: "Report Shared",
      description: `Report "${reportToShare?.title}" has been shared with ${shareDetails.recipients.length} recipient(s).`,
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Audit Reports</h1>
          <Button asChild>
            <Link href="/reports/generate">
              <FilePlus2 className="mr-2 h-5 w-5" /> Generate New Report
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports List</CardTitle>
            <CardDescription>Loading reports...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/3"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-foreground">Audit Reports</h1>
        <Button asChild>
          <Link href="/reports/generate">
            <FilePlus2 className="mr-2 h-5 w-5" /> Generate New Report
          </Link>
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> PDF downloads, sharing, and approval workflow are simulated.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports List</CardTitle>
          <CardDescription>View, download, or manage previously generated audit reports.</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Report Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead className="hidden md:table-cell">Template</TableHead>
                  <TableHead className="hidden md:table-cell">Version</TableHead>
                  <TableHead className="hidden lg:table-cell">File Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(report.status)}
                        className={getStatusBadgeClassName(report.status)}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(report.generatedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {mockReportTemplates.find((t) => t.id === report.templateId)?.name || "N/A"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{report.version}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={report.filePath ? "outline" : "secondary"}>
                        {report.filePath ? "Available" : "Generating"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(report.id)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewVersionHistory(report.id)}>
                            <History className="mr-2 h-4 w-4" /> View Version History
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadPdf(report)}
                            disabled={!report.filePath || downloadingReports.has(report.id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {downloadingReports.has(report.id) ? "Downloading..." : "Download PDF"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenShareModal(report)}>
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </DropdownMenuItem>

                          {report.status === "Awaiting Approval" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleApproveReport(report.id)}
                                className="text-green-600 hover:!text-green-700"
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Report
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRequestChanges(report.id)}
                                className="text-orange-600 hover:!text-orange-700"
                              >
                                <XCircle className="mr-2 h-4 w-4" /> Request Changes
                              </DropdownMenuItem>
                            </>
                          )}

                          {report.status === "Draft" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditDraft(report.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Draft
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 hover:!text-red-600"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No reports generated yet.</p>
          )}
        </CardContent>
      </Card>
      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        report={reportToShare}
        onShare={handleShareReport}
      />
    </div>
  )
}
