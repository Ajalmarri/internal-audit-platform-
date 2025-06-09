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

export function DocumentManagementCard({ assignmentId }: DocumentManagementCardProps) {
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
      category: "Evidence",
      url: file.url,
      downloadUrl: file.downloadUrl,
    }

    setDocuments((prev) => [newDocument, ...prev])
    setShowUpload(false)
  }

  const handleFileRemoved = (fileId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== fileId))
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
      // Fallback for mock documents
      console.log(`Downloading: ${document.name}`)
    }
  }

  const handleView = (document: Document) => {
    if (document.url) {
      window.open(document.url, "_blank")
    } else {
      console.log(`Viewing: ${document.name}`)
    }
  }

  const handleDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Evidence":
        return "bg-blue-100 text-blue-800"
      case "Working Papers":
        return "bg-green-100 text-green-800"
      case "Correspondence":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            Document Management
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowUpload(!showUpload)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Documents
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Component */}
        {showUpload && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <FileUpload
              onFileUploaded={handleFileUploaded}
              onFileRemoved={handleFileRemoved}
              category="assignment"
              entityId={assignmentId}
              maxFiles={10}
              acceptedTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".png", ".txt"]}
              maxSize={25}
            />
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-3">
          {documents.length > 0 ? (
            documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-sm">{document.name}</h4>
                      <Badge variant="outline" className={getCategoryColor(document.category)}>
                        {document.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
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
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleView(document)} className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(document)} className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload documents to get started</p>
            </div>
          )}
        </div>

        {/* Summary */}
        {documents.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total Documents: {documents.length}</span>
              <span>
                Total Size:{" "}
                {documents.reduce((acc, doc) => {
                  const size = Number.parseFloat(doc.size.split(" ")[0])
                  const unit = doc.size.split(" ")[1]
                  const bytes = unit === "MB" ? size * 1024 * 1024 : unit === "KB" ? size * 1024 : size
                  return acc + bytes
                }, 0) /
                  (1024 * 1024) <
                1
                  ? Math.round(
                      documents.reduce((acc, doc) => {
                        const size = Number.parseFloat(doc.size.split(" ")[0])
                        const unit = doc.size.split(" ")[1]
                        const bytes = unit === "MB" ? size * 1024 * 1024 : unit === "KB" ? size * 1024 : size
                        return acc + bytes
                      }, 0) / 1024,
                    ) + " KB"
                  : (
                      documents.reduce((acc, doc) => {
                        const size = Number.parseFloat(doc.size.split(" ")[0])
                        const unit = doc.size.split(" ")[1]
                        const bytes = unit === "MB" ? size * 1024 * 1024 : unit === "KB" ? size * 1024 : size
                        return acc + bytes
                      }, 0) /
                      (1024 * 1024)
                    ).toFixed(1) + " MB"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
