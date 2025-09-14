'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Upload, Loader2, Save, X } from 'lucide-react'

interface UploadedFile {
  fileName: string
  tempPath: string
  mime: string
  size: number
}

interface UploaderProps {
  findingId: string
  onEvidenceCommitted: () => void
}

export function Uploader({ findingId, onEvidenceCommitted }: UploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      if (result.ok) {
        const uploadedFileData: UploadedFile = {
          fileName: result.fileName,
          tempPath: result.tempPath,
          mime: result.mime,
          size: result.size
        }

        setUploadedFile(uploadedFileData)

        toast({
          title: "File uploaded successfully",
          description: `${result.fileName} is ready to be saved to this finding.`,
        })
      } else {
        throw new Error(result.error || 'Upload failed')
      }

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'An error occurred during upload',
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset input value so the same file can be picked again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCommitEvidence = async () => {
    if (!uploadedFile) return

    setIsCommitting(true)

    try {
      const response = await fetch(`/api/findings/${findingId}/evidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempPath: uploadedFile.tempPath,
          originalName: uploadedFile.fileName
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save evidence')
      }

      toast({
        title: "Evidence saved",
        description: `${uploadedFile.fileName} has been saved to this finding.`,
      })

      // Clear the uploaded file state
      setUploadedFile(null)
      
      // Trigger refresh of evidence list
      onEvidenceCommitted()

    } catch (error) {
      console.error('Commit error:', error)
      toast({
        title: "Failed to save evidence",
        description: error instanceof Error ? error.message : 'An error occurred while saving evidence',
        variant: "destructive",
      })
    } finally {
      setIsCommitting(false)
    }
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Choose File
            </>
          )}
        </Button>

        {uploadedFile && (
          <div className="flex items-center gap-2">
            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-md">
              ✓ {uploadedFile.fileName} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
            <Button
              type="button"
              onClick={handleCommitEvidence}
              disabled={isCommitting}
              size="sm"
              className="flex items-center gap-2"
            >
              {isCommitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save to Finding
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleClearFile}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Accepted formats: PDF, DOCX, XLSX, PNG, JPG (max 20MB)
      </div>
    </div>
  )
}











