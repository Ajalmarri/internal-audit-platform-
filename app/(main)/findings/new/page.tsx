"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
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
  Sparkles,
  Loader2,
  Briefcase,
  ChevronsUpDown,
  Check,
  RotateCw,
  CheckCircle,
} from "lucide-react"
import type { FindingCreationData, FindingSeverity, MockAssignment } from "../_types/finding-creation-types" // Added MockAssignment
import {
  mockFindingTemplates,
  initialFindingCreationData,
  // mockAssignments is no longer imported here
} from "../_types/finding-creation-types"
import { SaveModeIndicator, useSaveMode } from "@/components/ui/save-mode-indicator"
import { Uploader } from "./_components/Uploader"

// Interface for business units from API
interface BusinessUnitFromAPI {
  id: string
  name: string
}

// Mock AI Processor Function (remains unchanged)
const mockAiProcessor = async (notes: string): Promise<Partial<FindingCreationData>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerNotes = notes.toLowerCase()
      let title = "AI Draft: Review Required"
      let observation = ""
      let impact = ""
      let recommendation = ""
      if (lowerNotes.includes("unpatched server") && lowerNotes.includes("data breach")) {
        title = "Potential Data Breach from Unpatched Server"
        observation =
          "During the review of server logs for SRV-042, it was noted that critical security patch KB5001330, released on April 14, 2025, has not been applied. The server is currently exposed to the 'DataLeach' vulnerability."
        impact =
          "Failure to apply critical security patches in a timely manner exposes the organization to significant risk, including potential unauthorized access, data exfiltration, and system compromise. This could lead to financial loss, reputational damage, and regulatory fines."
        recommendation =
          "1. Immediately apply security patch KB5001330 to SRV-042.\n2. Conduct a full vulnerability scan on the server to identify any signs of compromise.\n3. Review and improve the patch management policy to ensure critical patches are applied within 72 hours of release."
      } else {
        observation = `Based on the provided notes, the primary observation is: ${notes.split(".")[0] || notes}.`
        impact = "The potential impact of this observation needs to be assessed."
        recommendation = "A recommendation should be formulated to address this observation."
      }
      resolve({
        observationTitle: title,
        detailedObservation: observation,
        impactRiskAssociated: impact,
        recommendation: recommendation,
      })
    }, 1500)
  })
}

export default function CreateNewFindingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const auditPlanIdFromParams = searchParams.get("auditPlanId")
  const assignmentIdFromParams = searchParams.get("assignmentId")

  const [formData, setFormData] = useState<FindingCreationData>({
    ...initialFindingCreationData,
    parentAssignmentId: assignmentIdFromParams || "",
  })
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(mockFindingTemplates[0].id)
  const [aiNotes, setAiNotes] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evidenceTempPath, setEvidenceTempPath] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Safety timeout to prevent stuck loading states
  useEffect(() => {
    if (isSubmitting) {
      const timeout = setTimeout(() => {
        console.warn('Form submission timeout - resetting states')
        setIsSubmitting(false)
        toast({
          title: "Submission Timeout",
          description: "The submission took longer than expected. Please try again.",
          variant: "destructive",
        })
      }, 30000) // 30 second timeout

      return () => clearTimeout(timeout)
    }
  }, [isSubmitting])

  // State for assignments
  const [availableAssignments, setAvailableAssignments] = useState<MockAssignment[]>([])
  const [assignmentsLoading, setAssignmentsLoading] = useState(true)
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null)
  const [assignmentPopoverOpen, setAssignmentPopoverOpen] = useState(false)

  // State for business units
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitFromAPI[]>([])
  const [businessUnitsLoading, setBusinessUnitsLoading] = useState(true)
  const [businessUnitsError, setBusinessUnitsError] = useState<string | null>(null)

  // Computed values
  const selectedAssignment = availableAssignments.find(a => a.id === formData.parentAssignmentId)
  const selectedAssignmentName = selectedAssignment ? selectedAssignment.name : "Select an assignment..."

  // Save mode management
  const { status, lastSaved, save, markUnsaved, reset } = useSaveMode()

  // Mark form as unsaved when data changes
  useEffect(() => {
    if (formData.observationTitle || formData.detailedObservation) {
      markUnsaved()
    }
  }, [formData, markUnsaved])

  // Reset save mode when form is reset
  useEffect(() => {
    if (status === 'idle') {
      reset()
    }
  }, [status, reset])

  const fetchAssignments = async () => {
    setAssignmentsLoading(true)
    setAssignmentsError(null)
    try {
      // Fetch assignments
      const assignmentsResponse = await fetch("/api/assignments")
      if (!assignmentsResponse.ok) {
        throw new Error(`Failed to fetch assignments: ${assignmentsResponse.statusText}`)
      }
      const assignmentsData = await assignmentsResponse.json()
      
      // Fetch audit plans to get names
      let auditPlansData: any[] = []
      try {
        const auditPlansResponse = await fetch("/api/audit-plans")
        if (auditPlansResponse.ok) {
          auditPlansData = await auditPlansResponse.json()
        }
      } catch (error) {
        console.log("Could not fetch audit plans, continuing without them")
      }
      
      // Transform the API data to match our MockAssignment interface
      const transformedAssignments: MockAssignment[] = assignmentsData.map((assignment: any) => {
        const auditPlan = auditPlansData.find(plan => plan.id === assignment.audit_plan_id)
        return {
          id: assignment.id,
          name: assignment.title || assignment.name || "Untitled Assignment",
          auditPlanName: auditPlan ? auditPlan.title : (assignment.audit_plan_id ? `Plan ID: ${assignment.audit_plan_id}` : undefined),
          status: assignment.status,
          description: assignment.description,
          startDate: assignment.start_date,
          endDate: assignment.end_date
        }
      })
      
      setAvailableAssignments(transformedAssignments)
    } catch (error) {
      console.error("Error fetching assignments:", error)
      setAssignmentsError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Error Loading Assignments",
        description: "Could not load assignments for selection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAssignmentsLoading(false)
    }
  }

  const fetchBusinessUnits = async () => {
    setBusinessUnitsLoading(true)
    setBusinessUnitsError(null)
    try {
      const response = await fetch('/api/primary-stakeholders')
      if (!response.ok) {
        throw new Error('Failed to fetch business units')
      }
      const data = await response.json()
      setBusinessUnits(data)
    } catch (error) {
      console.error('Error fetching business units:', error)
      setBusinessUnitsError(error instanceof Error ? error.message : 'Failed to fetch business units')
    } finally {
      setBusinessUnitsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
    fetchBusinessUnits()
  }, [])

  useEffect(() => {
    if (selectedTemplateId === "TPL000" || !selectedTemplateId) {
      setFormData({
        ...initialFindingCreationData,
        parentAssignmentId: assignmentIdFromParams || "",
      })
    }
  }, [selectedTemplateId, assignmentIdFromParams])

  const handleGenerateDraft = async () => {
    if (!aiNotes.trim()) {
      toast({
        title: "AI Assistant",
        description: "Please enter some notes for the AI to process.",
        variant: "destructive",
      })
      return
    }
    setIsGenerating(true)
    try {
      const draft = await mockAiProcessor(aiNotes)
      setFormData((prev) => ({
        ...prev,
        ...draft,
      }))
      toast({
        title: "AI Draft Generated",
        description: "The form fields have been populated. Please review and edit as needed.",
      })
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Could not generate draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }



  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId)
    const template = mockFindingTemplates.find((t) => t.id === templateId)
    if (template && template.id !== "TPL000") {
      setFormData({
        parentAssignmentId: formData.parentAssignmentId,
        templateId: template.id,
        observationTitle: template.prefilledObservationTitle || "",
        detailedObservation: template.prefilledDetailedObservation || "",
        criteriaExpectation: template.prefilledCriteriaExpectation || "",
        impactRiskAssociated: template.prefilledImpactRiskAssociated || "",
        severity: template.prefilledSeverity || "Medium",
        recommendation: template.prefilledRecommendation || "",
        affectedBusinessUnit: template.prefilledAffectedBusinessUnit || "",
        rootCause: template.prefilledRootCause || "",
        attachments: [],
      })
    } else {
      setFormData({
        ...initialFindingCreationData,
        parentAssignmentId: formData.parentAssignmentId,
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, fieldName: keyof FindingCreationData) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleAssignmentChange = (assignmentId: string) => {
    setFormData((prev) => ({ ...prev, parentAssignmentId: assignmentId }))
    markUnsaved()
  }



  const handleRemoveFile = (fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((file) => file.name !== fileName),
    }))
    // Clear evidence temp path if no files remain
    if (formData.attachments.length <= 1) {
      setEvidenceTempPath("")
    }
  }

  const handleSubmit = async (action: "saveDraft" | "submitForVerification") => {
    if (!formData.observationTitle || !formData.detailedObservation || !formData.affectedBusinessUnit) {
      toast({
        title: "Missing Information",
        description: "Please fill in the Observation Title, Detailed Observation, and Business Unit.",
        variant: "destructive",
      })
      return
    }

    if (isSubmitting) {
      return // Prevent multiple submissions
    }

    setIsSubmitting(true)

    const findingToSubmit = {
      title: formData.observationTitle,
      description: formData.detailedObservation,
      status: action === "saveDraft" ? "Draft" : "Pending Verification",
      severity: formData.severity,
      assignment_id: formData.parentAssignmentId || null,
      criteria: formData.criteriaExpectation,
      condition: formData.detailedObservation,
      cause: formData.rootCause,
      effect: formData.impactRiskAssociated,
      recommendation: formData.recommendation,
      responsibleBusinessOwner: formData.affectedBusinessUnit,
      evidenceTempPath: evidenceTempPath,
    }

    try {
      await save(async () => {
        const response = await fetch("/api/findings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(findingToSubmit),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Failed to save finding: ${response.statusText}`)
        }

        const result = await response.json()
        console.log("Finding saved successfully:", result)

        // Show success message
        const message = `Title: ${formData.observationTitle}`
        const engagementInfo = result.engagement ? `. Linked to engagement: ${result.engagement.title}` : ""
        const attachmentInfo = formData.attachments.length > 0 ? ` ${formData.attachments.length} evidence file(s) attached.` : ""
        const fullMessage = message + engagementInfo + ". You can view it on the engagement dashboard." + attachmentInfo

        toast({
          title: `Finding ${action === "saveDraft" ? "Saved as Draft" : "Submitted for Verification"}`,
          description: fullMessage,
        })

        // Navigate back to findings list
        setTimeout(() => {
          router.push("/findings")
        }, 2000)

        // Reset form after successful save
        setFormData({
          ...initialFindingCreationData,
          parentAssignmentId: assignmentIdFromParams || "",
        })
        setSelectedTemplateId(mockFindingTemplates[0].id)
        setAiNotes("")
      })
    } catch (error) {
      console.error('Error submitting finding:', error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred while submitting the finding.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }



  // Show loading state if submitting
  if (isSubmitting) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <h2 className="text-lg font-semibold">Saving Finding...</h2>
            <p className="text-muted-foreground">
              Please wait while we save your finding to the database.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        {(auditPlanIdFromParams || formData.parentAssignmentId) && (
          <div className="mb-4 text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
            {auditPlanIdFromParams && (
              <p>
                Creating finding for Audit Plan: <strong>{auditPlanIdFromParams}</strong>
              </p>
            )}
            {formData.parentAssignmentId && availableAssignments.find((a) => a.id === formData.parentAssignmentId) && (
              <p>
                Selected Parent Assignment:{" "}
                <strong>{availableAssignments.find((a) => a.id === formData.parentAssignmentId)?.name}</strong>
              </p>
            )}
            <Button variant="outline" size="sm" asChild className="mt-2">
              <Link
                href={
                  formData.parentAssignmentId &&
                  availableAssignments.find((a) => a.id === formData.parentAssignmentId && a.id !== "ASGN_NONE")
                    ? `/assignments/${formData.parentAssignmentId}`
                    : auditPlanIdFromParams
                      ? `/audit-plans/${auditPlanIdFromParams}`
                      : "/findings"
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Context
              </Link>
            </Button>
          </div>
        )}
        <h1 className="text-3xl font-semibold text-foreground">Create New Audit Finding</h1>
        <p className="text-muted-foreground">Document your observations and findings systematically.</p>
        
        {/* Save Mode Indicator */}
        <div className="mt-4">
          <SaveModeIndicator 
            status={status} 
            lastSaved={lastSaved}
            className="justify-start"
          />
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* AI Assistant Section */}
        <Card className="bg-gradient-to-br from-muted/30 to-muted/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
            <CardDescription>
              Enter your raw notes, observations, and evidence references below. The AI will help you draft a structured
              finding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="aiNotes"
              name="aiNotes"
              value={aiNotes}
              onChange={(e) => setAiNotes(e.target.value)}
              placeholder="Example: 'Server SRV-042 is missing critical patch KB5001330 from April...'"
              rows={5}
              className="bg-background/50"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerateDraft} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Draft
            </Button>
          </CardFooter>
        </Card>

        {/* Finding Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Finding Template
            </CardTitle>
            <CardDescription>Select a template to prefill common fields or start blank.</CardDescription>
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

        {/* Parent Assignment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Parent Assignment
            </CardTitle>
            <CardDescription>Select the audit assignment this finding belongs to.</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={assignmentPopoverOpen} onOpenChange={setAssignmentPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={assignmentPopoverOpen}
                  className="w-full justify-between"
                  disabled={assignmentsLoading || !!assignmentsError}
                >
                  <span className="truncate">
                    {assignmentsLoading
                      ? "Loading assignments..."
                      : assignmentsError
                        ? "Error loading"
                        : selectedAssignmentName}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search for an assignment..." />
                  <CommandList>
                    {assignmentsLoading && (
                      <div className="p-4 text-sm text-center text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Loading...
                      </div>
                    )}
                    {assignmentsError && !assignmentsLoading && (
                      <div className="p-4 text-sm text-center text-destructive">
                        <p>{assignmentsError}</p>
                        <Button variant="outline" size="sm" onClick={fetchAssignments} className="mt-2">
                          <RotateCw className="mr-2 h-4 w-4" /> Retry
                        </Button>
                      </div>
                    )}
                    {!assignmentsLoading && !assignmentsError && availableAssignments.length === 0 && (
                      <CommandEmpty>No assignment found.</CommandEmpty>
                    )}
                    {!assignmentsLoading && !assignmentsError && availableAssignments.length > 0 && (
                      <CommandGroup>
                        {availableAssignments.map((assignment) => (
                          <CommandItem
                            key={assignment.id}
                            value={assignment.name}
                            onSelect={() => {
                              handleAssignmentChange(assignment.id)
                              setAssignmentPopoverOpen(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formData.parentAssignmentId === assignment.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{assignment.name}</div>
                              {assignment.description && (
                                <div className="text-xs text-muted-foreground truncate">{assignment.description}</div>
                              )}
                              <div className="flex gap-2 mt-1">
                                {assignment.status && (
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                    {assignment.status}
                                  </span>
                                )}
                                {assignment.auditPlanName && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                    {assignment.auditPlanName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Show selected assignment details */}
            {selectedAssignment && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Selected Assignment Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedAssignment.name}</div>
                  {selectedAssignment.description && (
                    <div><span className="font-medium">Description:</span> {selectedAssignment.description}</div>
                  )}
                  {selectedAssignment.status && (
                    <div><span className="font-medium">Status:</span> 
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {selectedAssignment.status}
                      </span>
                    </div>
                  )}
                  {selectedAssignment.auditPlanName && (
                    <div><span className="font-medium">Audit Plan:</span> {selectedAssignment.auditPlanName}</div>
                  )}
                  {selectedAssignment.startDate && (
                    <div><span className="font-medium">Start Date:</span> {new Date(selectedAssignment.startDate).toLocaleDateString()}</div>
                  )}
                  {selectedAssignment.endDate && (
                    <div><span className="font-medium">Due Date:</span> {new Date(selectedAssignment.endDate).toLocaleDateString()}</div>
                  )}
                </div>
                
                {/* Show linked engagement information */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Linked Engagement</h5>
                  <div className="text-sm text-blue-700">
                    <p>✅ This finding will be automatically linked to the engagement associated with the selected assignment.</p>
                    <p className="mt-1 text-xs text-blue-600">
                      After creation, you can view this finding on the engagement dashboard under the "Linked Items" section.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observation Details */}
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
                placeholder="Describe your observation in detail..."
                rows={8}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis & Impact */}
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
                placeholder="Describe the potential or actual impact of this observation."
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
                <Label htmlFor="affectedBusinessUnit">Business Unit *</Label>
                <Select
                  name="affectedBusinessUnit"
                  value={formData.affectedBusinessUnit}
                  onValueChange={(value) => handleSelectChange(value, "affectedBusinessUnit")}
                  disabled={businessUnitsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      businessUnitsLoading 
                        ? "Loading business units..." 
                        : businessUnitsError 
                          ? "Error loading business units" 
                          : "Select business unit..."
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {businessUnitsError ? (
                      <div className="px-2 py-1.5 text-sm text-red-500">
                        Error: {businessUnitsError}
                      </div>
                    ) : businessUnits.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No business units available
                      </div>
                    ) : (
                      businessUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {businessUnitsError && (
                  <p className="text-xs text-red-500 mt-1">Failed to load business units. Please refresh the page.</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="rootCause">Root Cause (Optional)</Label>
              <Textarea
                id="rootCause"
                name="rootCause"
                value={formData.rootCause}
                onChange={handleChange}
                placeholder="Preliminary root cause analysis, if available."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recommendation */}
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

        {/* Supporting Evidence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Paperclip className="mr-2 h-5 w-5 text-primary" />
              Supporting Evidence
            </CardTitle>
            <CardDescription>Attach relevant documents, images, or other evidence.</CardDescription>
          </CardHeader>
          <CardContent>
            <Uploader 
              onUploaded={(file) => {
                setEvidenceTempPath(file.tempPath)
                // Create a File-like object for the attachment
                const newAttachment = new File(
                  [new Blob()], // Empty blob as placeholder
                  file.fileName,
                  { type: file.mime }
                )
                setFormData(prev => ({
                  ...prev,
                  attachments: [...prev.attachments, newAttachment]
                }))
              }}
            />
            
            {/* Hidden input for form submission */}
            <input 
              type="hidden" 
              id="evidenceTempPath" 
              name="evidenceTempPath" 
              value={evidenceTempPath}
            />
            
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Uploaded Files:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {formData.attachments.map((file, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                      <span>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(file.name)}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
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
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSubmit("saveDraft")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Saving..." : "Save Draft"}
          </Button>
          <Button 
            type="button" 
            onClick={() => handleSubmit("submitForVerification")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        </div>
      </form>
    </div>
  )
}
