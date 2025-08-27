"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import { MultiSelectCombobox, type MultiSelectOption } from "@/components/ui/multi-select-combobox"

// Define types for stakeholders and managers
type Stakeholder = {
  id: string
  name: string
}

type Manager = {
  id: string
  name: string
  role: string
}

// Define a type for assignments (ensure it matches API response)
type Assignment = {
  id: string
  title: string
}

const engagementSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    objective: z.string().min(10, "Objective must be at least 10 characters long"),
    scope: z.string().min(10, "Scope must be at least 10 characters long"),
    stakeholderId: z.string().min(1, "Primary Stakeholder is required"),
    managerId: z.string().min(1, "Engagement Manager is required"),
    startDate: z.date({ required_error: "Start Date is required" }),
    endDate: z.date({ required_error: "End Date is required" }),
    assignmentIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End Date cannot be before Start Date",
    path: ["endDate"],
  })

type EngagementFormData = z.infer<typeof engagementSchema>

async function saveEngagement(data: EngagementFormData) {
  console.log("Saving engagement:", data)
  
  try {
    const response = await fetch('/api/engagements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    
    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message,
        id: result.id
      }
    } else {
      return { 
        success: false, 
        message: result.message || 'Failed to create engagement. Please try again.' 
      }
    }
  } catch (error) {
    console.error('Error saving engagement:', error)
    return { 
      success: false, 
      message: 'An error occurred while creating the engagement. Please try again.' 
    }
  }
}

export default function NewEngagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const [stakeholders, setStakeholders] = React.useState<Stakeholder[]>([])
  const [managers, setManagers] = React.useState<Manager[]>([])
  const [isLoadingAssignments, setIsLoadingAssignments] = React.useState(true)
  const [isLoadingStakeholders, setIsLoadingStakeholders] = React.useState(true)
  const [isLoadingManagers, setIsLoadingManagers] = React.useState(true)

  React.useEffect(() => {
    async function fetchAssignments() {
      setIsLoadingAssignments(true)
      try {
        const response = await fetch("/api/assignments")
        if (!response.ok) {
          throw new Error(`Failed to fetch assignments: ${response.statusText}`)
        }
        const data: Assignment[] = await response.json()
        if (Array.isArray(data)) {
          setAssignments(data)
        } else {
          console.error("Fetched assignments data is not an array:", data)
          setAssignments([])
        }
      } catch (error) {
        console.error("Error fetching assignments:", error)
        toast({
          title: "Error Loading Assignments",
          description: "Could not load assignments. You can proceed without linking any.",
          variant: "destructive",
        })
        setAssignments([])
      } finally {
        setIsLoadingAssignments(false)
      }
    }
    fetchAssignments()
  }, [toast])

  React.useEffect(() => {
    async function fetchStakeholders() {
      setIsLoadingStakeholders(true)
      try {
        const response = await fetch("/api/primary-stakeholders")
        if (!response.ok) {
          throw new Error(`Failed to fetch stakeholders: ${response.statusText}`)
        }
        const data: Stakeholder[] = await response.json()
        if (Array.isArray(data)) {
          setStakeholders(data)
        } else {
          console.error("Fetched stakeholders data is not an array:", data)
          setStakeholders([])
        }
      } catch (error) {
        console.error("Error fetching stakeholders:", error)
        toast({
          title: "Error Loading Stakeholders",
          description: "Could not load stakeholders. Please refresh the page.",
          variant: "destructive",
        })
        setStakeholders([])
      } finally {
        setIsLoadingStakeholders(false)
      }
    }
    fetchStakeholders()
  }, [toast])

  React.useEffect(() => {
    async function fetchManagers() {
      setIsLoadingManagers(true)
      try {
        const response = await fetch("/api/managers")
        if (!response.ok) {
          throw new Error(`Failed to fetch managers: ${response.statusText}`)
        }
        const data: Manager[] = await response.json()
        if (Array.isArray(data)) {
          setManagers(data)
        } else {
          console.error("Fetched managers data is not an array:", data)
          setManagers([])
        }
      } catch (error) {
        console.error("Error fetching managers:", error)
        toast({
          title: "Error Loading Managers",
          description: "Could not load managers. Please refresh the page.",
          variant: "destructive",
        })
        setManagers([])
      } finally {
        setIsLoadingManagers(false)
      }
    }
    fetchManagers()
  }, [toast])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EngagementFormData>({
    resolver: zodResolver(engagementSchema),
    defaultValues: {
      title: "",
      objective: "",
      scope: "",
      stakeholderId: "",
      managerId: "",
      startDate: undefined,
      endDate: undefined,
      assignmentIds: [],
    },
  })

  const onSubmit = async (data: EngagementFormData) => {
    setIsSubmitting(true)
    try {
      const result = await saveEngagement(data)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        reset()
        router.push(`/engagements/${result.id}/dashboard`)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting engagement:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const assignmentOptions: MultiSelectOption[] = assignments.map((a) => ({
    value: a.id,
    label: a.title,
  }))

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-3xl">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Initiate New Audit Engagement</CardTitle>
          <CardDescription>Fill in the details below to start a new audit engagement.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Engagement Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input id="title" placeholder="e.g., 2025 Annual IT Security Audit" {...field} />
                )}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Objective</Label>
              <Controller
                name="objective"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="objective"
                    placeholder="Describe the main goals and purpose of this engagement."
                    className="min-h-[100px]"
                    {...field}
                  />
                )}
              />
              {errors.objective && <p className="text-sm text-red-500">{errors.objective.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Controller
                name="scope"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="scope"
                    placeholder="Define the boundaries and key areas to be covered by this engagement."
                    className="min-h-[100px]"
                    {...field}
                  />
                )}
              />
              {errors.scope && <p className="text-sm text-red-500">{errors.scope.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="stakeholderId">Primary Stakeholder</Label>
                <Controller
                  name="stakeholderId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingStakeholders}>
                      <SelectTrigger id="stakeholderId">
                        <SelectValue placeholder={isLoadingStakeholders ? "Loading stakeholders..." : "Select stakeholder"} />
                      </SelectTrigger>
                      <SelectContent>
                        {stakeholders.map((stakeholder) => (
                          <SelectItem key={stakeholder.id} value={stakeholder.id}>
                            {stakeholder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.stakeholderId && <p className="text-sm text-red-500">{errors.stakeholderId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerId">Engagement Manager</Label>
                <Controller
                  name="managerId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingManagers}>
                      <SelectTrigger id="managerId">
                        <SelectValue placeholder={isLoadingManagers ? "Loading managers..." : "Select manager"} />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.managerId && <p className="text-sm text-red-500">{errors.managerId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker date={field.value} setDate={field.onChange} placeholder="Select start date" />
                  )}
                />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker date={field.value} setDate={field.onChange} placeholder="Select end date" />
                  )}
                />
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentIds">Link to Existing Assignments (Optional)</Label>
              <Controller
                name="assignmentIds"
                control={control}
                render={({ field }) => (
                  <MultiSelectCombobox
                    options={assignmentOptions}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select assignments to link..."
                    searchPlaceholder="Search assignments..."
                    emptyMessage={isLoadingAssignments ? "Loading assignments..." : "No assignments found."}
                    disabled={isLoadingAssignments}
                  />
                )}
              />
              {errors.assignmentIds && <p className="text-sm text-red-500">{errors.assignmentIds.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingAssignments || isLoadingStakeholders || isLoadingManagers}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initiating...
                </>
              ) : (
                "Initiate Engagement"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
