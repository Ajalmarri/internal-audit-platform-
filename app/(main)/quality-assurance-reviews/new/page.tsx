"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { mockReviewers, mockAuditsToSample } from "../_types/qa-review-types"
import { SampledItemPickerModal } from "../_components/sampled-item-picker-modal"
import { ArrowLeft, ListChecks } from "lucide-react"

const formSchema = z.object({
  reviewPeriod: z.string().min(3, { message: "Review period must be at least 3 characters." }),
  leadReviewerId: z.string({ required_error: "Please select a lead reviewer." }),
  sampledAuditIds: z.array(z.string()).min(1, { message: "Please select at least one item to sample." }),
})

type NewQAReviewFormValues = z.infer<typeof formSchema>

export default function NewQAReviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false)

  const form = useForm<NewQAReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewPeriod: "",
      leadReviewerId: undefined,
      sampledAuditIds: [],
    },
  })

  const selectedItems = mockAuditsToSample.filter((item) => form.watch("sampledAuditIds").includes(item.id))

  function onSubmit(values: NewQAReviewFormValues) {
    console.log("New QA Review Data:", values)
    const newReviewId = `QA-${Date.now().toString().slice(-6)}`
    toast({
      title: "QA Review Created",
      description: `Review "${values.reviewPeriod}" (ID: ${newReviewId}) has been scheduled.`,
    })
    router.push("/quality-assurance-reviews")
  }

  const handleConfirmSampledItems = (selectedIds: string[]) => {
    form.setValue("sampledAuditIds", selectedIds, { shouldValidate: true })
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/quality-assurance-reviews"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to QA Reviews
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Start New Quality Assurance Review</CardTitle>
          <CardDescription>Complete the form below to initiate a new QA review process.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="reviewPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Period</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Q3 2025 Review, Annual IT Audit Review" {...field} />
                    </FormControl>
                    <FormDescription>A descriptive name for this QA review cycle.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leadReviewerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Reviewer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a lead reviewer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockReviewers.map((reviewer) => (
                          <SelectItem key={reviewer.id} value={reviewer.id}>
                            {reviewer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>The manager responsible for conducting this QA review.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sampledAuditIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Sampled Audits/Items</FormLabel>
                    <div className="p-3 border rounded-md min-h-[80px] bg-muted/30">
                      {selectedItems.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedItems.map((item) => (
                            <Badge key={item.id} variant="secondary" className="text-sm">
                              {item.name} ({item.type})
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No items selected yet.</p>
                      )}
                    </div>
                    <Button type="button" variant="outline" className="mt-2" onClick={() => setIsPickerModalOpen(true)}>
                      <ListChecks className="mr-2 h-4 w-4" />
                      Select Items ({form.watch("sampledAuditIds").length})
                    </Button>
                    <FormDescription>
                      Click the button to select specific audit plans, findings, or engagements for this review.
                    </FormDescription>
                    <FormMessage /> {/* This will show the "Please select at least one item" error */}
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Review"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <SampledItemPickerModal
        isOpen={isPickerModalOpen}
        onOpenChange={setIsPickerModalOpen}
        availableItems={mockAuditsToSample}
        initialSelectedIds={form.getValues("sampledAuditIds")}
        onConfirmSelection={handleConfirmSampledItems}
      />
    </div>
  )
}
