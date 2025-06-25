"use client" // This page uses client-side state for filters

import { useState, useMemo } from "react"
import { EvidenceFiltersComponent } from "./_components/evidence-filters"
import { EvidenceTable } from "./_components/evidence-table"
import type { EvidenceFile, EvidenceFilters } from "./_types/evidence-types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

  const handleFilterChange = (newFilters: EvidenceFilters) => {
    setFilters(newFilters)
  }

  const filteredEvidence = useMemo(() => {
    return mockEvidenceFiles.filter((file) => {
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase()
        const inFileName = file.fileName.toLowerCase().includes(searchTermLower)
        const inTags = file.tags?.some((tag) => tag.toLowerCase().includes(searchTermLower))
        // Add content search if possible, for now just filename and tags
        if (!inFileName && !inTags) return false
      }
      if (filters.assignmentId && file.linkedAssignment.id !== filters.assignmentId) return false
      if (filters.findingId && file.linkedFindingId !== filters.findingId) return false // Assuming findingId is a direct match
      if (filters.uploaderId && file.uploader.id !== filters.uploaderId) return false
      if (filters.evidenceType && file.evidenceType !== filters.evidenceType) return false
      if (filters.uploadDateStart && new Date(file.uploadDate) < new Date(filters.uploadDateStart)) return false
      if (filters.uploadDateEnd && new Date(file.uploadDate) > new Date(filters.uploadDateEnd)) return false
      return true
    })
  }, [filters])

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Central Evidence Locker</h1>
        <p className="text-muted-foreground mt-1">
          Search, manage, and review all evidence across all audit engagements.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filter & Search Evidence</CardTitle>
          <CardDescription>Use the filters below to find specific evidence files.</CardDescription>
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

      <EvidenceTable evidenceFiles={filteredEvidence} />
    </div>
  )
}
