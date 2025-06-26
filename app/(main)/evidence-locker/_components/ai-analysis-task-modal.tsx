"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import type { EvidenceFile } from "../_types/evidence-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AiAnalysisTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitTask: (selectedFileIds: string[], instruction: string) => void
  evidenceFiles: EvidenceFile[]
}

export function AiAnalysisTaskModal({ isOpen, onClose, onSubmitTask, evidenceFiles }: AiAnalysisTaskModalProps) {
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set())
  const [analysisInstruction, setAnalysisInstruction] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Reset state when modal opens/closes if needed
    if (!isOpen) {
      setSelectedFileIds(new Set())
      setAnalysisInstruction("")
    }
  }, [isOpen])

  const handleFileSelect = (fileId: string) => {
    setSelectedFileIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      return newSet
    })
  }

  const handleSubmit = () => {
    if (selectedFileIds.size === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one document to analyze.",
        variant: "destructive",
      })
      return
    }
    if (!analysisInstruction.trim()) {
      toast({
        title: "Instruction Missing",
        description: "Please provide an analysis instruction.",
        variant: "destructive",
      })
      return
    }
    onSubmitTask(Array.from(selectedFileIds), analysisInstruction)
    onClose() // Close modal on successful submission
  }

  const examplePrompts = [
    "Find all expenses over $500 without a receipt.",
    "Summarize the key points of these meeting notes.",
    "Identify any PII (Personally Identifiable Information) in these documents.",
    "Extract all contract renewal dates and counterparties.",
    "List all control deficiencies mentioned in these audit reports.",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Document Analysis Task</DialogTitle>
          <DialogDescription>Select documents and provide instructions for AI-powered analysis.</DialogDescription>
        </DialogHeader>

        <div className="flex-grow grid grid-rows-[auto,1fr] gap-6 py-4 overflow-hidden">
          {/* Step 1: Select Evidence */}
          <div className="space-y-2 overflow-hidden flex flex-col">
            <Label htmlFor="evidence-selection" className="text-lg font-semibold">
              Step 1: Select Evidence
            </Label>
            <p className="text-sm text-muted-foreground">
              Choose one or more documents from the Evidence Locker for analysis.
            </p>
            <ScrollArea className="border rounded-md flex-grow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploader</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evidenceFiles.length > 0 ? (
                    evidenceFiles.map((file) => (
                      <TableRow key={file.id} onClick={() => handleFileSelect(file.id)} className="cursor-pointer">
                        <TableCell>
                          <Checkbox
                            checked={selectedFileIds.has(file.id)}
                            onCheckedChange={() => handleFileSelect(file.id)}
                            aria-label={`Select file ${file.fileName}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{file.fileName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{file.fileType}</Badge>
                        </TableCell>
                        <TableCell>{file.uploader.name}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No evidence files available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            <p className="text-sm text-muted-foreground pt-1">Selected {selectedFileIds.size} document(s).</p>
          </div>

          {/* Step 2: Define Analysis Instruction */}
          <div className="space-y-2 overflow-hidden flex flex-col">
            <Label htmlFor="analysis-instruction" className="text-lg font-semibold">
              Step 2: Define Analysis Instruction
            </Label>
            <Textarea
              id="analysis-instruction"
              placeholder="What do you want to know about these documents?"
              value={analysisInstruction}
              onChange={(e) => setAnalysisInstruction(e.target.value)}
              className="min-h-[100px] flex-grow"
            />
            <div className="text-xs text-muted-foreground space-y-1 pt-1">
              <p className="font-medium">Example Prompts:</p>
              <ul className="list-disc list-inside pl-2">
                {examplePrompts.map((prompt, index) => (
                  <li key={index}>{prompt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Start Analysis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
