"use client" // This page uses client-side state for filters

import { useState, useMemo } from "react"
import Link from "next/link"
import { EvidenceFiltersComponent } from "./_components/evidence-filters"
import { EvidenceTable } from "./_components/evidence-table"
import { AiAnalysisTaskModal } from "./_components/ai-analysis-task-modal"
import { addMockAnalysisResult } from "./analysis/[analysisId]/page" // Helper to update mock store
import type { EvidenceFile, EvidenceFilters, AiAnalysisResult } from "./_types/evidence-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sparkles, FileText, CalendarDays, ListChecks } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Mock Data - Replace with actual data fetching
const mockAssignments = [
  { id: "AS001", title: "Financial Statement Audit FY2024" },
  { id: "AS002", title: "IT General Controls Review Q3" },
  { id: "AS003", title: "Compliance Check - GDPR" },
]

const mockUploaders = [
  { id: "USR001", name: "Alice Wonderland", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "USR002", name: "Bob The Builder", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "USR003", name: "Charlie Brown", avatar: "/placeholder.svg?height=32&width=32" },
]

const mockEvidenceTypes = [
  "Financial Statement",
  "Interview Notes",
  "System Log",
  "Policy Document",
  "Procedure Manual",
  "Confirmation Letter",
]

const mockEvidenceFiles: EvidenceFile[] = [
  {
    id: "EV001",
    fileName: "FY2024_BalanceSheet_Final.pdf",
    fileType: "pdf",
    evidenceType: "Financial Statement",
    linkedAssignment: mockAssignments[0],
    version: "v1.2",
    uploader: mockUploaders[0],
    uploadDate: new Date("2024-07-15T10:30:00Z"),
    size: "1.2 MB",
    tags: ["finance", "balance sheet", "fy2024"],
  },
  {
    id: "EV002",
    fileName: "Interview_CFO_Notes.docx",
    fileType: "docx",
    evidenceType: "Interview Notes",
    linkedAssignment: mockAssignments[0],
    version: "v1.0",
    uploader: mockUploaders[1],
    uploadDate: new Date("2024-07-16T14:00:00Z"),
    size: "85 KB",
    tags: ["interview", "cfo", "notes"],
  },
  {
    id: "EV003",
    fileName: "ServerAccessLogs_July.csv",
    fileType: "csv",
    evidenceType: "System Log",
    linkedAssignment: mockAssignments[1],
    version: "v2.0",
    uploader: mockUploaders[2],
    uploadDate: new Date("2024-07-18T09:15:00Z"),
    size: "5.5 MB",
    tags: ["itgc", "logs", "server access"],
  },
  {
    id: "EV004",
    fileName: "Data_Privacy_Policy_v3.pdf",
    fileType: "pdf",
    evidenceType: "Policy Document",
    linkedAssignment: mockAssignments[2],
    version: "v3.0",
    uploader: mockUploaders[0],
    uploadDate: new Date("2024-06-20T11:00:00Z"),
    size: "450 KB",
    tags: ["gdpr", "policy", "data privacy"],
  },
  {
    id: "EV005",
    fileName: "Bank_Confirmation_ABC_Corp.png",
    fileType: "png",
    evidenceType: "Confirmation Letter",
    linkedAssignment: mockAssignments[0],
    version: "v1.0",
    uploader: mockUploaders[1],
    uploadDate: new Date("2024-07-22T16:45:00Z"),
    size: "300 KB",
    tags: ["confirmation", "bank", "financial"],
  },
]

export default function EvidenceLockerPage() {
  const [filters, setFilters] = useState<EvidenceFilters>({})
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AiAnalysisResult[]>([])
  const { toast } = useToast()

  const handleFilterChange = (newFilters: EvidenceFilters) => {
    setFilters(newFilters)
  }

  const filteredEvidence = useMemo(() => {
    return mockEvidenceFiles.filter((file) => {
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase()
        const inFileName = file.fileName.toLowerCase().includes(searchTermLower)
        const inTags = file.tags?.some((tag) => tag.toLowerCase().includes(searchTermLower))
        if (!inFileName && !inTags) return false
      }
      if (filters.assignmentId && file.linkedAssignment.id !== filters.assignmentId) return false
      if (filters.findingId && file.linkedFindingId !== filters.findingId) return false
      if (filters.uploaderId && file.uploader.id !== filters.uploaderId) return false
      if (filters.evidenceType && file.evidenceType !== filters.evidenceType) return false
      if (filters.uploadDateStart && new Date(file.uploadDate) < new Date(filters.uploadDateStart)) return false
      if (filters.uploadDateEnd && new Date(file.uploadDate) > new Date(filters.uploadDateEnd)) return false
      return true
    })
  }, [filters, mockEvidenceFiles])

  const handleStartAnalysisTask = (selectedFileIds: string[], instruction: string) => {
    const selectedFiles = mockEvidenceFiles.filter((file) => selectedFileIds.includes(file.id))
    
    // Use a more stable approach for client-side only operations
    const timestamp = Date.now()
    const newResultId = `AI-TASK-${timestamp}`
    const pageNumber = Math.floor(Math.random() * 10) + 1
    
    const newResult: AiAnalysisResult = {
      id: newResultId,
      analysisTitle: `Analysis: ${instruction.substring(0, 50)}${instruction.length > 50 ? "..." : ""}`,
      instruction,
      analyzedFileNames: selectedFiles.map((f) => f.fileName),
      dateRun: new Date(),
      status: "Completed", // Simulate completion for now
      summary: `This is a mock AI summary for the instruction: "${instruction}".\n\nKey findings include A, B, and C based on the analysis of ${selectedFiles.length} document(s): ${selectedFiles.map((f) => f.fileName).join(", ")}. Further details are available in the exceptions list.`,
      exceptions:
        selectedFiles.length > 0
          ? [
              {
                id: "ex1-" + newResultId,
                fileName: selectedFiles[0].fileName,
                pageNumber: pageNumber,
                quote: "Example critical phrase found in document.",
                reason: "This phrase indicates a potential compliance issue that needs review.",
              },
              {
                id: "ex2-" + newResultId,
                fileName: selectedFiles[Math.max(0, selectedFiles.length - 1)].fileName,
                quote: "Another example finding requiring attention.",
                reason: "This requires further investigation by the audit team.",
              },
            ]
          : [],
    }

    addMockAnalysisResult(newResult) // Add to our mock store for the details page
    setAnalysisResults((prevResults) => [newResult, ...prevResults])
    toast({
      title: "AI Analysis Started",
      description: `Task "${newResult.analysisTitle}" created and mock results generated.`,
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Central Evidence Locker</h1>
          <p className="text-muted-foreground mt-1">
            Search, manage, and review all evidence across all audit engagements.
          </p>
        </div>
        <Button onClick={() => setIsAnalysisModalOpen(true)} className="w-full sm:w-auto">
          <Sparkles className="mr-2 h-4 w-4" /> Analyze Documents with AI
        </Button>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Filter & Search Evidence</CardTitle>
              <CardDescription>Use the filters below to find specific evidence files.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EvidenceFiltersComponent
            onFilterChange={handleFilterChange}
            assignments={mockAssignments}
            uploaders={mockUploaders}
            evidenceTypes={mockEvidenceTypes}
          />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {analysisResults.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>View reports generated by AI document intelligence.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {analysisResults.map((result) => (
              <Card key={result.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{result.analysisTitle}</CardTitle>
                  <CardDescription>Instruction: "{result.instruction}"</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>Run on: {new Date(result.dateRun).toISOString().split('T')[0]}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>
                      Files Analyzed: {result.analyzedFileNames.length} (
                      {result.analyzedFileNames.slice(0, 2).join(", ")}
                      {result.analyzedFileNames.length > 2 ? "..." : ""})
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ListChecks className="mr-2 h-4 w-4" />
                    <span>
                      Status:{" "}
                      <Badge variant={result.status === "Completed" ? "success" : "secondary"}>{result.status}</Badge>
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={`/evidence-locker/analysis/${result.id}`}>View Results</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      <EvidenceTable evidenceFiles={filteredEvidence} />

      <AiAnalysisTaskModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onSubmitTask={handleStartAnalysisTask}
        evidenceFiles={mockEvidenceFiles} // Pass all available files to the modal
      />
    </div>
  )
}
