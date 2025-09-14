'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Paperclip, Download, Trash2, FileText, Image, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Uploader } from './_components/Uploader'
import { EvidenceActions } from './_components/EvidenceActions'

interface EvidenceDocument {
  DocumentID: number
  DocumentName: string
  DocumentFileName: string
  DocumentFileType: string
  DocumentFileSize: number
  CreatedDate: string
  CreatedBy: number
}

interface EvidencePanelProps {
  findingId: string
}

export function EvidencePanel({ findingId }: EvidencePanelProps) {
  const [evidence, setEvidence] = useState<EvidenceDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvidence = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/findings/${findingId}/evidence`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch evidence')
      }

      setEvidence(result)
    } catch (err) {
      console.error('Failed to fetch evidence:', err)
      setError('Failed to load evidence documents')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvidence()
  }, [findingId])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('PDF')) return <FileText className="h-4 w-4 text-red-500" />
    if (fileType.includes('Image')) return <Image className="h-4 w-4 text-blue-500" />
    if (fileType.includes('Spreadsheet')) return <FileSpreadsheet className="h-4 w-4 text-green-500" />
    return <Paperclip className="h-4 w-4 text-gray-500" />
  }

  const getFileTypeBadge = (fileType: string) => {
    if (fileType.includes('PDF')) return <Badge variant="destructive">PDF</Badge>
    if (fileType.includes('Word')) return <Badge variant="default">Word</Badge>
    if (fileType.includes('Excel') || fileType.includes('Spreadsheet')) return <Badge variant="secondary">Excel</Badge>
    if (fileType.includes('Image')) return <Badge variant="outline">Image</Badge>
    return <Badge variant="outline">{fileType}</Badge>
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Paperclip className="mr-2 h-5 w-5 text-primary" />
            Evidence & Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading evidence...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Paperclip className="mr-2 h-5 w-5 text-primary" />
            Evidence & Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchEvidence} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Paperclip className="mr-2 h-5 w-5 text-primary" />
          Evidence & Documentation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
                 {/* Upload Section */}
         <div className="border-b pb-6">
           <h3 className="text-lg font-medium mb-4">Upload New Evidence</h3>
           <Uploader findingId={findingId} onEvidenceCommitted={fetchEvidence} />
         </div>

        {/* Evidence List */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            Evidence Documents ({evidence.length})
          </h3>
          
          {evidence.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Paperclip className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No evidence uploaded yet</p>
              <p className="text-sm">Upload your first evidence document above</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidence.map((doc) => (
                    <TableRow key={doc.DocumentID}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.DocumentFileType)}
                          <span className="truncate max-w-[200px]" title={doc.DocumentName}>
                            {doc.DocumentName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getFileTypeBadge(doc.DocumentFileType)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatFileSize(doc.DocumentFileSize)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(doc.CreatedDate)}
                      </TableCell>
                                             <TableCell className="text-right">
                         <EvidenceActions
                           findingId={findingId}
                           documentId={doc.DocumentID}
                           documentName={doc.DocumentName}
                           onDeleted={fetchEvidence}
                         />
                       </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
