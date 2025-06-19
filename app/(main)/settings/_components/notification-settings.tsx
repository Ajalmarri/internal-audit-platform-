"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const notificationOptions = [
  {
    id: "new-assignment",
    title: "New Assignment",
    description: "Get notified when you are added to a new assignment.",
    defaultChecked: true,
  },
  {
    id: "task-due-soon",
    title: "Task Due Soon",
    description: "Receive a reminder 24 hours before a task is due.",
    defaultChecked: true,
  },
  {
    id: "action-plan-submitted",
    title: "Action Plan Submitted",
    description: "Get notified when a business owner submits an action plan for your review.",
    defaultChecked: true,
  },
  {
    id: "finding-approved-rejected",
    title: "Finding Approved/Rejected",
    description: "Receive a notification when a finding you submitted is approved or rejected.",
    defaultChecked: false,
  },
]

export default function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure the alerts you receive across the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationOptions.map((option) => (
          <div key={option.id} className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={option.id} className="text-base font-medium">
                {option.title}
              </Label>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <Switch id={option.id} defaultChecked={option.defaultChecked} />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
