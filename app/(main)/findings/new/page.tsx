"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  Info,
  AlertTriangle,
  Lightbulb,
  Paperclip,
  UploadCloud,
  X,
} from "lucide-react"
import type { FindingCreationData, FindingSeverity } from "../_types/finding-creation-types"
import { mockFindingTemplates, mockBusinessUnits, initialFindingCreationData } from "../_types/finding-creation-types"

export default function CreateNewFindingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const auditPlanId = searchParams.get("auditPlanId")
  const assignmentId = searchParams.get("assignmentId")

  const [formData, setFormData] = useState<FindingCreationData>(initialFindingCreationData)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(mockFindingTemplates[0].id) // Default to "Blank"
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Apply blank template by default or if selectedTemplateId changes to blank
    if (selectedTemplateId === "TPL000" || !selectedTemplateId) {
      setFormData(initialFindingCreationData)
    }
  }, [selectedTemplateId])

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)
    const template = mockFindingTemplates.find((t) => t.id === templateId)
    if (template && template.id !== "TPL000") {
      setFormData({
        ...initialFindingCreationData, // Reset to default then apply template
        templateId: template.id,
        observationTitle: template.prefilledObservationTitle || "",
        detailedObservation: template.prefilledDetailedObservation || "",
        criteriaExpectation: template.prefilledCriteriaExpectation || "",
        impactRiskAssociated: template.prefilledImpactRiskAssociated || "",
        severity: template.prefilledSeverity || "Medium",
        recommendation: template.prefilledRecommendation || "",
        affectedBusinessUnit: template.prefilledAffectedBusinessUnit || "",
        rootCause: template.prefilledRootCause || "",
        attachments: [], // Reset attachments when template changes
      })
    } else {
      // Reset to blank if "Blank Template" is chosen or no template found
      setFormData(initialFindingCreationData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, fieldName: keyof FindingCreationData) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      // Prevent duplicates by name, simple check
      const uniqueNewFiles = newFiles.filter((file) => !formData.attachments.some((f) => f.name === file.name))
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...uniqueNewFiles],
      }))
    }
  }

  const handleRemoveFile = (fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((file) => file.name !== fileName),
    }))
    // Reset file input to allow re-adding the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (action: "saveDraft" | "submitForVerification") => {
    if (!formData.observationTitle || !formData.detailedObservation) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the Observation Title and Detailed Observation.",
        variant: "destructive",
      })
      return
    }

    const findingToSubmit = {
      ...formData,
      status: action === "saveDraft" ? "Draft" : "Pending Verification",
      auditPlanId, // Include context if available
      assignmentId,
    }

    console.log("Finding Data:", findingToSubmit)
    // In a real app, you'd send this to the backend.
    // For attachments, you'd typically upload them first and then send their URLs/IDs.

    toast({
      title: `Finding ${action === "saveDraft" ? "Saved as Draft" : "Submitted for Verification"}`,
      description: `Title: ${formData.observationTitle}`,
    })

    // Optionally, redirect or clear form
    // router.push(assignmentId ? `/assignments/${assignmentId}` : "/findings");
    setFormData(initialFindingCreationData) // Clear form for next entry
    setSelectedTemplateId(mockFindingTemplates[0].id) // Reset template
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        {/* Contextual Information Placeholder */}
        {(auditPlanId || assignmentId) && (
          <div className="mb-4 text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
            {auditPlanId && (
              <p>
                Creating finding for Audit Plan: <strong>{auditPlanId}</strong>
              </p>
            )}
            {assignmentId && (
              <p>
                Creating finding for Assignment: <strong>{assignmentId}</strong>
              </p>
            )}
            <Button variant="outline" size="sm" asChild className="mt-2">
              <Link
                href={
                  assignmentId
                    ? `/assignments/${assignmentId}`
                    : auditPlanId
                      ? `/audit-plans/${auditPlanId}`
                      : "/dashboard"
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Context
              </Link>
            </Button>
          </div>
        )}
        <h1 className="text-3xl font-semibold text-foreground">Create New Audit Finding</h1>
        <p className="text-muted-foreground">Document your observations and findings systematically.</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Finding Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Finding Template
            </CardTitle>
            <CardDescription>
              Select a template to prefill common fields or start blank. Using templates helps ensure all necessary
              information is captured systematically. [cite: 196][cite: 197]
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                {mockFindingTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} - <span className="text-xs text-muted-foreground">{template.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Finding Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary" />
              Observation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="observationTitle">Observation Title / Headline</Label>
              <Input
                id="observationTitle"
                name="observationTitle"
                value={formData.observationTitle}
                onChange={handleChange}
                placeholder="Enter a concise title for the finding"
                required
              />
            </div>
            <div>
              <Label htmlFor="detailedObservation">Detailed Observation</Label>
              <Textarea
                id="detailedObservation"
                name="detailedObservation"
                value={formData.detailedObservation}
                onChange={handleChange}
                placeholder="Describe your observation in detail. What did you see, hear, or find?"
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                For rich formatting (bold, lists, etc.), a Rich Text Editor (e.g., Tiptap, Lexical) would be integrated
                here in a full application.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
              Analysis & Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="criteriaExpectation">Criteria / Expectation</Label>
              <Textarea
                id="criteriaExpectation"
                name="criteriaExpectation"
                value={formData.criteriaExpectation}
                onChange={handleChange}
                placeholder="What is the standard, policy, regulation, or expectation that was not met?"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="impactRiskAssociated">Impact / Risk Associated</Label>
              <Textarea
                id="impactRiskAssociated"
                name="impactRiskAssociated"
                value={formData.impactRiskAssociated}
                onChange={handleChange}
                placeholder="Describe the potential or actual impact of this observation. What are the associated risks?"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="severity">Finding Rating / Severity</Label>
                <Select
                  name="severity"
                  value={formData.severity}
                  onValueChange={(value) => handleSelectChange(value as FindingSeverity, "severity")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="affectedBusinessUnit">Affected Business Unit / Department (Optional)</Label>
                <Select
                  name="affectedBusinessUnit"
                  value={formData.affectedBusinessUnit}
                  onValueChange={(value) => handleSelectChange(value, "affectedBusinessUnit")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit/department..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None / Not Applicable</SelectItem>
                    {mockBusinessUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.name}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="rootCause">Root Cause (Optional)</Label>
              <Textarea
                id="rootCause"
                name="rootCause"
                value={formData.rootCause}
                onChange={handleChange}
                placeholder="Preliminary root cause analysis, if available. Why did this happen?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-primary" />
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="recommendation">Recommendation</Label>
              <Textarea
                id="recommendation"
                name="recommendation"
                value={formData.recommendation}
                onChange={handleChange}
                placeholder="Propose recommendations to address the finding."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Paperclip className="mr-2 h-5 w-5 text-primary" />
              Supporting Evidence
            </CardTitle>
            <CardDescription>
              Attach relevant documents, images, or other evidence. Multiple files can be uploaded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 border-2 border-dashed border-muted rounded-lg text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <Label
                htmlFor="file-upload"
                className="mt-2 text-sm font-medium text-primary hover:underline cursor-pointer"
              >
                Click to browse or drag and drop files
              </Label>
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="sr-only" // Hidden, triggered by label
              />
              <p className="mt-1 text-xs text-muted-foreground">Supported formats: PDF, DOCX, XLSX, PNG, JPG, etc.</p>
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Selected Files:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {formData.attachments.map((file, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                      <span>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveFile(file.name)}
                        className="text-destructive hover:text-destructive-hover"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => handleSubmit("saveDraft")}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button type="button" onClick={() => handleSubmit("submitForVerification")}>
            <Send className="mr-2 h-4 w-4" /> Submit for Verification [cite: 198]
          </Button>
        </div>
      </form>
    </div>
  )
}
