"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import { FileText, Download, Eye, Trash2, Upload, FolderOpen, Calendar, User } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
  category: string
  url?: string
  downloadUrl?: string
}

interface DocumentManagementCardProps {
  assignmentId: string
}

export default function DocumentManagementCard({ assignmentId }: DocumentManagementCardProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      name: "Risk Assessment Checklist.pdf",
      type: "PDF",
      size: "2.3 MB",
      uploadedBy: "Sarah Chen",
      uploadedAt: "2024-01-15",
      category: "Evidence",
    },
    {
      id: "doc2",
      name: "Control Testing Results.xlsx",
      type: "Excel",
      size: "1.8 MB",
      uploadedBy: "Mike Johnson",
      uploadedAt: "2024-01-14",
      category: "Working Papers",
    },
    {
      id: "doc3",
      name: "Management Response.docx",
      type: "Word",
      size: "456 KB",
      uploadedBy: "Lisa Wang",
      uploadedAt: "2024-01-13",
      category: "Correspondence",
    },
  ])

  const [showUpload, setShowUpload] = useState(false)

  const handleFileUploaded = (file: any) => {
    const newDocument: Document = {
      id: file.id,
      name: file.name,
      type: file.type.split("/")[1].toUpperCase(),
      size: formatFileSize(file.size),
      uploadedBy: "Current User", // In production, get from auth
      uploadedAt: new Date().toISOString().split("T")[0],
      category: "Evidence", // Or derive from upload context
      url: file.url,
      downloadUrl: file.downloadUrl,
    }

    setDocuments((prev) => [newDocument, ...prev])
    setShowUpload(false)
  }

  const handleFileRemoved = (fileId: string) => {
    // This function might be called by FileUpload if it supports direct removal
    // For now, we assume deletion is handled by the handleDelete function below
    console.log("File removal requested by FileUpload component:", fileId)
    // If FileUpload handles its own state for pending uploads, this might not be needed
    // or might be used to update a list of *staged* files before final submission.
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDownload = (document: Document) => {
    if (document.downloadUrl) {
      window.open(document.downloadUrl, "_blank")
    } else {
      // Fallback for mock documents or if downloadUrl is not yet available
      console.log(`Downloading (mock): ${document.name}`)
      // Simulate download for mock data
      const blob = new Blob([`Mock content for ${document.name}`], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = document.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleView = (document: Document) => {
    if (document.url) {
      window.open(document.url, "_blank")
    } else {
      console.log(`Viewing (mock): ${document.name}`)
      // For mock data, maybe show a modal or log to console
      alert(`Mock view of ${document.name}. In a real app, this would open the document viewer or a preview.`)
    }
  }

  const handleDelete = async (documentId: string) => {
    // In a real app, you would make an API call here to delete the file from storage
    // For example: await fetch(`/api/files/${documentId}`, { method: 'DELETE' });
    console.log(`Deleting document: ${documentId}`)
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    // Potentially call an onFileRemoved callback if FileUpload needs to be notified
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Evidence":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Working Papers":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Correspondence":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            Document Management
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowUpload(!showUpload)}>
            <Upload className="mr-2 h-4 w-4" />
            {showUpload ? "Cancel Upload" : "Upload Documents"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showUpload && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <FileUpload
              onFileUploaded={handleFileUploaded}
              onFileRemoved={handleFileRemoved} // This prop might not be used by FileUpload for deletion, but for clearing its own list
              category="assignment_documents" // More specific category
              entityId={assignmentId}
              maxFiles={10}
              acceptedTypes={[
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "image/jpeg",
                "image/png",
                "text/plain",
              ]}
              maxSize={25 * 1024 * 1024} // 25MB in bytes
            />
          </div>
        )}

        <div className="space-y-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3 sm:gap-2"
              >
                <div className="flex items-center space-x-3 flex-grow min-w-0">
                  <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-sm truncate" title={document.name}>
                        {document.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`${getCategoryColor(document.category)} text-xs px-1.5 py-0.5`}
                      >
                        {document.category}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center space-x-0 sm:space-x-4 text-xs text-muted-foreground mt-1 gap-x-2 gap-y-1">
                      <span className="flex items-center">
                        <FileText className="mr-1 h-3 w-3" />
                        {document.type} • {document.size}
                      </span>
                      <span className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {document.uploadedBy}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0 self-start sm:self-center">
                  <Button variant="ghost" size="icon" onClick={() => handleView(document)} className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View {document.name}</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(document)} className="h-8 w-8">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download {document.name}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(document.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete {document.name}</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">No documents uploaded yet</p>
              <p className="text-sm">Click "Upload Documents" to get started.</p>
            </div>
          )}
        </div>

        {documents.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total Documents: {documents.length}</span>
              <span>
                Total Size: {(() => {
                  const totalBytes = documents.reduce((acc, doc) => {
                    const parts = doc.size.split(" ")
                    if (parts.length < 2) return acc
                    const size = Number.parseFloat(parts[0])
                    const unit = parts[1].toUpperCase()
                    let bytes = 0
                    if (unit === "MB") {
                      bytes = size * 1024 * 1024
                    } else if (unit === "KB") {
                      bytes = size * 1024
                    } else if (unit === "BYTES") {
                      bytes = size
                    }
                    return acc + bytes
                  }, 0)

                  if (totalBytes === 0) return "0 Bytes"
                  const k = 1024
                  const sizes = ["Bytes", "KB", "MB", "GB"]
                  const i = Math.floor(Math.log(totalBytes) / Math.log(k))
                  return Number.parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
                })()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
