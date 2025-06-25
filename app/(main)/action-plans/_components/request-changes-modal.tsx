"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ActionPlan } from "../_types/action-plan-types"

interface RequestChangesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitFeedback: (actionPlanId: string, feedback: string) => void
  actionPlan: ActionPlan | null
}

export default function RequestChangesModal({
  isOpen,
  onClose,
  onSubmitFeedback,
  actionPlan,
}: RequestChangesModalProps) {
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    if (actionPlan && actionPlan.reviewFeedback) {
      setFeedback(actionPlan.reviewFeedback)
    } else {
      setFeedback("")
    }
  }, [actionPlan])

  if (!actionPlan) return null

  const handleSubmit = () => {
    onSubmitFeedback(actionPlan.id, feedback)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Request Changes for Action Plan {actionPlan.id}</DialogTitle>
          <DialogDescription>
            Provide comments on what needs to be modified in this action plan. Your feedback will be sent to the
            business owner.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor={`feedback-${actionPlan.id}`}>Feedback Comments</Label>
            <Textarea
              id={`feedback-${actionPlan.id}`}
              placeholder="e.g., Please clarify the timeline for item AP001-2, provide more details on the resources needed for..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!feedback.trim()}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
