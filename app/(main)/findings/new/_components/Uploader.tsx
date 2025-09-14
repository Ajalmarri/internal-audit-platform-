'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Upload, Loader2 } from 'lucide-react'

interface UploadedFile {
  fileName: string
  tempPath: string
  mime: string
  size: number
}

interface UploaderProps {
  onUploaded: (file: UploadedFile) => void
}

export function Uploader({ onUploaded }: UploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
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
        onUploaded(uploadedFileData)

        toast({
          title: "File uploaded successfully",
          description: `${result.fileName} (${(result.size / 1024 / 1024).toFixed(2)} MB)`,
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
          <div className="text-sm text-green-600">
            ✓ {uploadedFile.fileName} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Accepted formats: PDF, DOCX, XLSX, PNG, JPG (max 20MB)
      </div>
    </div>
  )
}











