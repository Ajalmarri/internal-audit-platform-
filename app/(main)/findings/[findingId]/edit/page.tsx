"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Form validation schema
const editFindingSchema = z.object({
  Title: z.string().min(3, "Title must be at least 3 characters"),
  FindingDescription: z.string().optional(),
  AssignmentID: z.number().int().positive("Please select an assignment"),
  FindingStatusID: z.number().int().positive("Please select a status"),
  SeverityID: z.number().int().positive("Please select a severity"),
  BusinessOwnerID: z.number().int().positive("Please select a business owner"),
  Recommendation: z.string().optional(),
  Criteria: z.string().optional(),
  Impact: z.string().optional(),
  RootCause: z.string().optional(),
  ManagementResponse: z.boolean().optional(),
  ManagementComment: z.string().optional()
})

type EditFindingForm = z.infer<typeof editFindingSchema>

interface Finding {
  id: string
  title: string
  description?: string
  assignment_id?: string
  status_id?: number
  severity_id?: number
  business_owner?: string
  criteria?: string
  impact?: string
  recommendations?: string
  cause?: string
  management_response?: number
  management_comment?: string
}

interface DropdownOption {
  id: number
  name: string
}

export default function EditFindingPage() {
  const params = useParams()
  const router = useRouter()
  const findingId = params.findingId as string

  const [finding, setFinding] = useState<Finding | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dropdown data
  const [statuses, setStatuses] = useState<DropdownOption[]>([])
  const [severities, setSeverities] = useState<DropdownOption[]>([])
  const [businessOwners, setBusinessOwners] = useState<DropdownOption[]>([])
  const [assignments, setAssignments] = useState<DropdownOption[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EditFindingForm>({
    resolver: zodResolver(editFindingSchema)
  })

  const managementResponse = watch("ManagementResponse")

  const fetchFinding = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/findings/${findingId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Finding not found")
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
        return
      }
      
      const data = await response.json()
      setFinding(data)
      
      // Prefill form with existing data
      setValue("Title", data.title || "")
      setValue("FindingDescription", data.description || "")
      setValue("AssignmentID", data.assignment_id ? parseInt(data.assignment_id) : 0)
      setValue("FindingStatusID", data.status_id || 0)
      setValue("SeverityID", data.severity_id || 0)
      setValue("BusinessOwnerID", data.business_owner ? parseInt(data.business_owner) : 0)
      setValue("Recommendation", data.recommendations || "")
      setValue("Criteria", data.criteria || "")
      setValue("Impact", data.impact || "")
      setValue("RootCause", data.cause || "")
      setValue("ManagementResponse", data.management_response === 1)
      setValue("ManagementComment", data.management_comment || "")
    } catch (error) {
      console.error('Error loading finding:', error)
      setError('Failed to load finding details')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDropdownData = async () => {
    try {
      // Fetch all dropdown data in parallel
      const [statusesRes, severitiesRes, stakeholdersRes, assignmentsRes] = await Promise.all([
        fetch('/api/finding-statuses'),
        fetch('/api/severities'),
        fetch('/api/primary-stakeholders'),
        fetch('/api/assignments')
      ])

      if (statusesRes.ok) {
        const statusesData = await statusesRes.json()
        setStatuses(statusesData.map((s: any) => ({ id: s.FindingStatusID, name: s.FindingStatus })))
      }

      if (severitiesRes.ok) {
        const severitiesData = await severitiesRes.json()
        setSeverities(severitiesData.map((s: any) => ({ id: s.SeverityID, name: s.Severity })))
      }

      if (stakeholdersRes.ok) {
        const stakeholdersData = await stakeholdersRes.json()
        setBusinessOwners(stakeholdersData.map((s: any) => ({ id: s.id, name: s.name })))
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json()
        setAssignments(assignmentsData.map((a: any) => ({ id: a.id, name: a.title })))
      }
    } catch (error) {
      console.error('Error loading dropdown data:', error)
    }
  }

  useEffect(() => {
    if (findingId) {
      fetchFinding()
      fetchDropdownData()
    }
  }, [findingId])

  const onSubmit = async (data: EditFindingForm) => {
    try {
      setIsSubmitting(true)
      
      const response = await fetch(`/api/findings/${findingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const result = await response.json()
      
      toast({
        title: "Finding Updated",
        description: "The finding has been successfully updated.",
      })

      // Navigate back to finding details
      router.push(`/findings/${findingId}`)
      
    } catch (error) {
      console.error('Error updating finding:', error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update finding",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading finding details...</span>
      </div>
    )
  }

  if (error || !finding) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Finding Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "The finding you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Finding</h1>
            <p className="text-muted-foreground">Update finding details and information</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Finding Details</CardTitle>
          <CardDescription>
            Update the finding information below. All required fields must be completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="Title">Title *</Label>
                <Input
                  id="Title"
                  {...register("Title")}
                  placeholder="Enter finding title"
                />
                {errors.Title && (
                  <p className="text-sm text-red-500">{errors.Title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="AssignmentID">Assignment *</Label>
                <Select
                  value={watch("AssignmentID")?.toString() || ""}
                  onValueChange={(value) => setValue("AssignmentID", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.id.toString()}>
                        {assignment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.AssignmentID && (
                  <p className="text-sm text-red-500">{errors.AssignmentID.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="FindingDescription">Description</Label>
              <Textarea
                id="FindingDescription"
                {...register("FindingDescription")}
                placeholder="Enter finding description"
                rows={4}
              />
              {errors.FindingDescription && (
                <p className="text-sm text-red-500">{errors.FindingDescription.message}</p>
              )}
            </div>

            {/* Status and Severity */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="FindingStatusID">Status *</Label>
                <Select
                  value={watch("FindingStatusID")?.toString() || ""}
                  onValueChange={(value) => setValue("FindingStatusID", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.FindingStatusID && (
                  <p className="text-sm text-red-500">{errors.FindingStatusID.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="SeverityID">Severity *</Label>
                <Select
                  value={watch("SeverityID")?.toString() || ""}
                  onValueChange={(value) => setValue("SeverityID", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severities.map((severity) => (
                      <SelectItem key={severity.id} value={severity.id.toString()}>
                        {severity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.SeverityID && (
                  <p className="text-sm text-red-500">{errors.SeverityID.message}</p>
                )}
              </div>
            </div>

            {/* Business Owner */}
            <div className="space-y-2">
              <Label htmlFor="BusinessOwnerID">Business Owner *</Label>
              <Select
                value={watch("BusinessOwnerID")?.toString() || ""}
                onValueChange={(value) => setValue("BusinessOwnerID", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business owner" />
                </SelectTrigger>
                <SelectContent>
                  {businessOwners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id.toString()}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.BusinessOwnerID && (
                <p className="text-sm text-red-500">{errors.BusinessOwnerID.message}</p>
              )}
            </div>

            {/* Analysis Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Analysis Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="Criteria">Criteria</Label>
                <Textarea
                  id="Criteria"
                  {...register("Criteria")}
                  placeholder="Enter criteria"
                  rows={3}
                />
                {errors.Criteria && (
                  <p className="text-sm text-red-500">{errors.Criteria.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="Impact">Impact</Label>
                <Textarea
                  id="Impact"
                  {...register("Impact")}
                  placeholder="Enter impact description"
                  rows={3}
                />
                {errors.Impact && (
                  <p className="text-sm text-red-500">{errors.Impact.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="RootCause">Root Cause</Label>
                <Textarea
                  id="RootCause"
                  {...register("RootCause")}
                  placeholder="Enter root cause analysis"
                  rows={3}
                />
                {errors.RootCause && (
                  <p className="text-sm text-red-500">{errors.RootCause.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="Recommendation">Recommendation</Label>
                <Textarea
                  id="Recommendation"
                  {...register("Recommendation")}
                  placeholder="Enter recommendations"
                  rows={3}
                />
                {errors.Recommendation && (
                  <p className="text-sm text-red-500">{errors.Recommendation.message}</p>
                )}
              </div>
            </div>

            {/* Management Response */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Management Response</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="ManagementResponse"
                  checked={managementResponse || false}
                  onCheckedChange={(checked) => setValue("ManagementResponse", checked)}
                />
                <Label htmlFor="ManagementResponse">Management Response Required</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ManagementComment">Management Comment</Label>
                <Textarea
                  id="ManagementComment"
                  {...register("ManagementComment")}
                  placeholder="Enter management comment"
                  rows={3}
                />
                {errors.ManagementComment && (
                  <p className="text-sm text-red-500">{errors.ManagementComment.message}</p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Finding
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}