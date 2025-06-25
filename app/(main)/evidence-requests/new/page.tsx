"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { ArrowLeft, Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import type { BusinessOwner, MinimalAssignmentInfo, EvidenceRequestPriority } from "../_types/evidence-request-types"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required."),
  linkedAssignmentId: z.string().min(1, "Linked assignment is required."),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters.")
    .max(150, "Subject must be less than 150 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(2000, "Description must be less than 2000 characters."),
  dueDate: z.date().optional(),
  priority: z.enum(["High", "Medium", "Low"], {
    required_error: "Priority is required.",
  }),
})

// Mock data - replace with API calls
const mockBusinessOwners: BusinessOwner[] = [
  { id: "bo1", name: "Alice Wonderland", email: "alice@example.com", department: "Finance" },
  { id: "bo2", name: "Bob The Builder", email: "bob@example.com", department: "IT" },
  { id: "bo3", name: "Charlie Brown", email: "charlie@example.com", department: "Operations" },
  { id: "bo4", name: "Diana Prince", email: "diana@example.com", department: "HR" },
]

const mockAssignments: MinimalAssignmentInfo[] = [
  { id: "asg1", title: "Q1 Financial Audit" },
  { id: "asg2", title: "IT Security Review FY2024" },
  { id: "asg3", title: "Compliance Check - GDPR" },
  { id: "asg4", title: "Operational Efficiency Assessment" },
]

export default function NewEvidenceRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      priority: "Medium",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log("Sending request:", values)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast({
      title: "Request Sent",
      description: `Evidence request "${values.subject}" has been sent.`,
    })
    form.reset()
    setIsSubmitting(false)
  }

  async function handleSaveDraft(values: z.infer<typeof formSchema>) {
    setIsSavingDraft(true)
    console.log("Saving draft:", values)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Draft Saved",
      description: `Evidence request "${values.subject}" has been saved as a draft.`,
    })
    setIsSavingDraft(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/evidence-locker">
            {" "}
            {/* Or wherever evidence requests are listed */}
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Evidence Locker</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">New Evidence Request</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Fill out the form below to request evidence from a business owner or stakeholder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recipientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Recipient</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                          >
                            {field.value
                              ? mockBusinessOwners.find((owner) => owner.id === field.value)?.name
                              : "Select recipient"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search recipient..." />
                          <CommandList>
                            <CommandEmpty>No recipient found.</CommandEmpty>
                            <CommandGroup>
                              {mockBusinessOwners.map((owner) => (
                                <CommandItem
                                  value={owner.name}
                                  key={owner.id}
                                  onSelect={() => {
                                    form.setValue("recipientId", owner.id)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      owner.id === field.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div>
                                    <p>{owner.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {owner.email} - {owner.department}
                                    </p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the business owner or stakeholder who will receive this request.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedAssignmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linked Assignment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an assignment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockAssignments.map((assignment) => (
                          <SelectItem key={assignment.id} value={assignment.id}>
                            {assignment.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Link this request to a specific audit assignment.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Request for Q1 User Access Logs" {...field} />
                    </FormControl>
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
                        placeholder="Provide specific details, instructions, or questions for the recipient..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date (Optional)</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} placeholder="Select a due date" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(["High", "Medium", "Low"] as EvidenceRequestPriority[]).map((priorityLevel) => (
                            <SelectItem key={priorityLevel} value={priorityLevel}>
                              {priorityLevel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.handleSubmit(handleSaveDraft)()}
                  disabled={isSavingDraft || isSubmitting}
                >
                  {isSavingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save as Draft
                </Button>
                <Button type="submit" disabled={isSubmitting || isSavingDraft}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Request
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
