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
import { MultiSelectCombobox, type MultiSelectOption } from "@/components/ui/multi-select-combobox" // Import the new component

// Mock data - replace with actual data fetching or props
const mockStakeholders = [
  { id: "stakeholder-1", name: "IT Department" },
  { id: "stakeholder-2", name: "Finance Department" },
  { id: "stakeholder-3", name: "Legal Department" },
]

const mockManagers = [
  { id: "manager-1", name: "Yema al Olman" },
  { id: "manager-2", name: "Khaled M." },
]

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
    assignmentIds: z.array(z.string()).optional(), // Changed to array for multiple assignments
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End Date cannot be before Start Date",
    path: ["endDate"],
  })

type EngagementFormData = z.infer<typeof engagementSchema>

async function saveEngagement(data: EngagementFormData) {
  console.log("Saving engagement:", data)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  // Use a more stable approach for client-side only operations
  const success = Math.random() > 0.1
  const id = success ? `ENG-${Math.floor(Math.random() * 900) + 100}` : null
  
  if (success) {
    return {
      success: true,
      message: "Engagement initiated successfully!",
      id: id,
    }
  } else {
    return { success: false, message: "Failed to initiate engagement. Please try again." }
  }
}

export default function NewEngagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const [isLoadingAssignments, setIsLoadingAssignments] = React.useState(true)

  React.useEffect(() => {
    async function fetchAssignments() {
      setIsLoadingAssignments(true)
      try {
        const response = await fetch("/api/assignments") // Ensure this API returns { id: string, title: string }[]
        if (!response.ok) {
          throw new Error(`Failed to fetch assignments: ${response.statusText}`)
        }
        const data: Assignment[] = await response.json()
        if (Array.isArray(data)) {
          setAssignments(data)
        } else {
          console.error("Fetched assignments data is not an array:", data)
          setAssignments([]) // Set to empty array on unexpected format
          throw new Error("Fetched assignments data is not in the expected format.")
        }
      } catch (error) {
        console.error(error)
        toast({
          title: "Error Loading Assignments",
          description: "Could not load assignments. You can proceed without linking any.",
          variant: "destructive",
        })
        setAssignments([]) // Ensure assignments is an empty array on error
      } finally {
        setIsLoadingAssignments(false)
      }
    }
    fetchAssignments()
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
      assignmentIds: [], // Default to an empty array
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
            {/* ... other fields (title, objective, scope, stakeholder, manager, dates) remain the same ... */}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="stakeholderId">
                        <SelectValue placeholder="Select stakeholder" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStakeholders.map((stakeholder) => (
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="managerId">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockManagers.map((manager) => (
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

            {/* Updated Field for Linking Multiple Assignments */}
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
            <Button type="submit" disabled={isSubmitting || isLoadingAssignments}>
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
