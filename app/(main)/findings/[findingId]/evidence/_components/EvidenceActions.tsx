'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Download, Trash2, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface EvidenceActionsProps {
  findingId: string
  documentId: number
  documentName: string
  onDeleted?: () => void
}

export function EvidenceActions({ findingId, documentId, documentName, onDeleted }: EvidenceActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDownload = () => {
    const downloadUrl = `/api/files/download?findingId=${findingId}&documentId=${documentId}`
    window.open(downloadUrl, '_blank')
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/findings/${findingId}/evidence?documentId=${documentId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete evidence')
      }

      toast({
        title: "Evidence deleted",
        description: `${documentName} has been removed from this finding.`,
      })

      // Refresh the evidence list
      if (onDeleted) {
        onDeleted()
      }

    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Failed to delete evidence",
        description: error instanceof Error ? error.message : 'An error occurred while deleting evidence',
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        Download
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Evidence</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
