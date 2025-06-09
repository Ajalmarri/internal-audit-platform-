"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, FileText, Calendar, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockReportTemplates, mockBusinessOwnersForReport } from "../_types/report-types"
import { mockFindings } from "../../findings/_types/finding-types"

interface FormData {
  title: string
  description: string
  templateId: string
  targetBusinessOwnerId: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  includedFindingIds: string[]
  recipients: Array<{
    id: string
    name: string
    email: string
    type: string
  }>
}

export default function GenerateReportPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    templateId: "",
    targetBusinessOwnerId: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
    includedFindingIds: [],
    recipients: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Report title is required"
    }

    if (!formData.templateId) {
      newErrors.templateId = "Please select a template"
    }

    if (formData.dateRange.from && formData.dateRange.to) {
      if (formData.dateRange.from >= formData.dateRange.to) {
        newErrors.dateRange = "Start date must be before end date"
      }
    }

    if (formData.includedFindingIds.length === 0) {
      newErrors.findings = "Please select at least one finding to include"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          templateId: formData.templateId,
          targetBusinessOwnerId: formData.targetBusinessOwnerId || null,
          dateRange:
            formData.dateRange.from && formData.dateRange.to
              ? {
                  from: formData.dateRange.from.toISOString(),
                  to: formData.dateRange.to.toISOString(),
                }
              : null,
          includedFindingIds: formData.includedFindingIds,
          recipients: formData.recipients,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate report")
      }

      const result = await response.json()

      toast({
        title: "Report Generated Successfully",
        description: `${result.report.title} has been generated and is ready for download.`,
      })

      // Navigate to the generated report
      router.push(`/reports/${result.report.id}`)
    } catch (error) {
      console.error("Report generation error:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFindingToggle = (findingId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      includedFindingIds: checked
        ? [...prev.includedFindingIds, findingId]
        : prev.includedFindingIds.filter((id) => id !== findingId),
    }))

    // Clear findings error when user selects findings
    if (checked && errors.findings) {
      setErrors((prev) => ({ ...prev, findings: "" }))
    }
  }

  const selectedTemplate = mockReportTemplates.find((t) => t.id === formData.templateId)

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/reports">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Generate New Report</h1>
            <p className="text-muted-foreground">Create a comprehensive audit report</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Report Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }))
                }}
                placeholder="Enter report title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the report purpose and scope"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">
                Report Template <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.templateId}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, templateId: value }))
                  if (errors.templateId) setErrors((prev) => ({ ...prev, templateId: "" }))
                }}
              >
                <SelectTrigger className={errors.templateId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {mockReportTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.templateId && <p className="text-sm text-red-500">{errors.templateId}</p>}
              {selectedTemplate && <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Business Owner</Label>
              <Select
                value={formData.targetBusinessOwnerId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, targetBusinessOwnerId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business owner (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {mockBusinessOwnersForReport.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.name} ({owner.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Report Period</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">From</Label>
                  <DatePicker
                    date={formData.dateRange.from}
                    onDateChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: date },
                      }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">To</Label>
                  <DatePicker
                    date={formData.dateRange.to}
                    onDateChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: date },
                      }))
                    }
                  />
                </div>
              </div>
              {errors.dateRange && <p className="text-sm text-red-500">{errors.dateRange}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Findings Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Include Findings <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {errors.findings && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.findings}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {mockFindings.map((finding) => (
                <div key={finding.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={finding.id}
                    checked={formData.includedFindingIds.includes(finding.id)}
                    onCheckedChange={(checked) => handleFindingToggle(finding.id, checked as boolean)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={finding.id} className="font-medium cursor-pointer">
                      {finding.title}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          finding.severity === "Critical"
                            ? "bg-red-100 text-red-800"
                            : finding.severity === "High"
                              ? "bg-orange-100 text-orange-800"
                              : finding.severity === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <span className="text-sm text-muted-foreground">{finding.responsibleBusinessOwner}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Selected: {formData.includedFindingIds.length} finding(s)
            </p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/reports")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isGenerating} className="min-w-[140px]">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
