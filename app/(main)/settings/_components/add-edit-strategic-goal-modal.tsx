"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { StrategicGoal } from "../_types/settings-types"

const goalFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(100, "Title cannot exceed 100 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long.")
    .max(500, "Description cannot exceed 500 characters."),
})

type GoalFormValues = z.infer<typeof goalFormSchema>

interface AddEditStrategicGoalModalProps {
  isOpen: boolean
  onClose: () => void
  goalToEdit?: StrategicGoal | null
  onSave: (goal: StrategicGoal) => void
}

export default function AddEditStrategicGoalModal({
  isOpen,
  onClose,
  goalToEdit,
  onSave,
}: AddEditStrategicGoalModalProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  useEffect(() => {
    if (goalToEdit) {
      form.reset({
        title: goalToEdit.title,
        description: goalToEdit.description,
      })
    } else {
      form.reset({
        title: "",
        description: "",
      })
    }
  }, [goalToEdit, form, isOpen]) // Re-run effect if isOpen changes to reset form when modal opens

  const onSubmit = (data: GoalFormValues) => {
    const goalData: StrategicGoal = {
      id: goalToEdit?.id || `sg${Date.now()}${Math.random().toString(16).slice(2)}`,
      ...data,
    }
    onSave(goalData)
    onClose() // Close modal after save
  }

  const handleCloseDialog = () => {
    form.reset() // Reset form on close
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{goalToEdit ? "Edit Strategic Goal" : "Add New Strategic Goal"}</DialogTitle>
          <DialogDescription>
            {goalToEdit ? "Update the details of this strategic goal." : "Provide details for the new strategic goal."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Enhance Data Security" {...field} />
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
                      placeholder="e.g., Improve security controls to reduce data breach risk..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? goalToEdit
                    ? "Saving..."
                    : "Adding..."
                  : goalToEdit
                    ? "Save Changes"
                    : "Add Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
