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
import { DatePicker } from "@/components/ui/date-picker" // Assuming you have this
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

// Mock data - replace with actual data fetching or props
const mockStakeholders = [
  { id: "stakeholder-1", name: "IT Department" },
  { id: "stakeholder-2", name: "Finance Department" },
  { id: "stakeholder-3", name: "Legal Department" },
  { id: "stakeholder-4", name: "Procurement" },
  { id: "stakeholder-5", name: "Compliance Office" },
  { id: "stakeholder-6", name: "Operations" },
  { id: "stakeholder-7", name: "Risk Management" },
]

const mockManagers = [
  { id: "manager-1", name: "Yema al Olman" },
  { id: "manager-2", name: "Khaled M." },
  { id: "manager-3", name: "John Doe" },
  { id: "manager-4", name: "Jane Smith" },
]

const engagementSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    objective: z.string().min(10, "Objective must be at least 10 characters long"),
    scope: z.string().min(10, "Scope must be at least 10 characters long"),
    stakeholderId: z.string().min(1, "Primary Stakeholder is required"),
    managerId: z.string().min(1, "Engagement Manager is required"),
    startDate: z.date({ required_error: "Start Date is required" }),
    endDate: z.date({ required_error: "End Date is required" }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End Date cannot be before Start Date",
    path: ["endDate"],
  })

type EngagementFormData = z.infer<typeof engagementSchema>

// Mock function to simulate saving data
async function saveEngagement(data: EngagementFormData) {
  console.log("Saving engagement:", data)
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))
  // Simulate success/failure
  if (Math.random() > 0.1) {
    // 90% success rate
    return {
      success: true,
      message: "Engagement initiated successfully!",
      id: `ENG-${Math.floor(Math.random() * 900) + 100}`,
    }
  } else {
    return { success: false, message: "Failed to initiate engagement. Please try again." }
  }
}

export default function NewEngagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
        reset() // Reset form
        // Optionally navigate to the new engagement's detail page or back to the list
        router.push(`/engagements/${result.id}/dashboard`) // Or router.push('/engagements')
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
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Initiating..." : "Initiate Engagement"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
