"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker" // Assuming this custom component exists
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"

const findingSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(150),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(2000),
  recommendation: z.string().min(10, { message: "Recommendation must be at least 10 characters." }).max(2000),
  severity: z.enum(["Critical", "High", "Medium", "Low", "Informational"], {
    required_error: "Severity is required.",
  }),
  status: z.enum(["Open", "In Progress", "Remediated", "Closed", "Risk Accepted"], {
    required_error: "Status is required.",
  }),
  assignedTo: z.string().optional(),
  dueDate: z.date().optional(),
})

type FindingFormValues = z.infer<typeof findingSchema>

// Mock function to simulate saving a finding
async function saveFinding(engagementId: string, data: FindingFormValues) {
  console.log("Saving finding for engagement:", engagementId, data)
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate potential error
  // if (Math.random() > 0.7) {
  //   throw new Error("Failed to save finding due to a simulated server error.");
  // }

  const newFindingId = `FIND-${Date.now().toString().slice(-4)}`
  return { ...data, id: newFindingId, engagementId }
}

export default function NewFindingPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const engagementId = params.engagementId as string

  const form = useForm<FindingFormValues>({
    resolver: zodResolver(findingSchema),
    defaultValues: {
      title: "",
      description: "",
      recommendation: "",
      status: "Open", // Default status
      severity: undefined, // No default for severity to force selection
      assignedTo: "",
      dueDate: undefined,
    },
  })

  async function onSubmit(values: FindingFormValues) {
    setIsSubmitting(true)
    try {
      const newFinding = await saveFinding(engagementId, values)
      toast({
        title: "Finding Created Successfully!",
        description: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Finding "{newFinding.title}" (ID: {newFinding.id}) has been added.
          </div>
        ),
        variant: "default",
      })
      // Redirect to the engagement's dashboard or the new finding's detail page
      router.push(`/engagements/${engagementId}/dashboard`) // Or `/engagements/${engagementId}/findings/${newFinding.id}`
    } catch (error) {
      console.error("Failed to create finding:", error)
      toast({
        title: "Error Creating Finding",
        description: (
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            {error instanceof Error ? error.message : "An unexpected error occurred."}
          </div>
        ),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/engagements/${engagementId}/dashboard`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Engagement Dashboard</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Finding</h1>
          <p className="text-muted-foreground">For Engagement ID: {engagementId}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Finding Details</CardTitle>
          <CardDescription>Fill in the information below to create a new audit finding.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Unpatched Server Vulnerability" {...field} />
                    </FormControl>
                    <FormDescription>A concise title for the finding.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the finding, including context and impact..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide a comprehensive description of what was observed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recommendation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Suggested actions to remediate or mitigate the finding..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Outline the recommended steps for resolution.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Informational">Informational</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Assess the impact and urgency of the finding.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Remediated">Remediated</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                          <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Current status of the finding.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe or IT Department" {...field} />
                      </FormControl>
                      <FormDescription>Person or team responsible for addressing the finding.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date (Optional)</FormLabel>
                      <FormControl>
                        <DatePicker date={field.value} onDateChange={field.onChange} />
                      </FormControl>
                      <FormDescription>Target date for remediation.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Finding"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
