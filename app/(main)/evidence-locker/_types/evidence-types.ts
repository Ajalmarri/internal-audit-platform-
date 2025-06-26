import type { UserStub } from "@/app/(main)/assignments/[assignmentId]/_types/assignment-types"

export type EvidenceFileType =
  | "pdf"
  | "xlsx"
  | "csv"
  | "docx"
  | "doc"
  | "png"
  | "jpg"
  | "jpeg"
  | "txt"
  | "zip"
  | "unknown"

export interface EvidenceFile {
  id: string
  fileName: string
  fileType: EvidenceFileType
  evidenceType: string // e.g., 'Financial Statement', 'Interview Notes', 'System Log'
  linkedAssignment: {
    id: string
    title: string
  }
  linkedFindingId?: string
  version: string // e.g., "v1.0", "v1.2"
  uploader: UserStub
  uploadDate: Date
  size: string // e.g., "2.5 MB"
  tags?: string[]
  url?: string // For download
  description?: string
}

export interface EvidenceFilters {
  searchTerm?: string
  assignmentId?: string
  findingId?: string
  uploaderId?: string
  uploadDateStart?: Date
  uploadDateEnd?: Date
  evidenceType?: string
}

export interface AiAnalysisResult {
  id: string
  analysisTitle: string // Could be user-defined or auto-generated
  instruction: string
  analyzedFileNames: string[]
  dateRun: Date
  status: "Completed" | "In Progress" | "Failed"
  // summary?: string; // For the actual results page
  // exceptionsFound?: number; // For the actual results page
}
