"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import Link from "next/link"

const riskLevels = [
  { id: "critical", label: "Critical", defaultColor: "#ef4444" },
  { id: "high", label: "High", defaultColor: "#f97316" },
  { id: "medium", label: "Medium", defaultColor: "#eab308" },
  { id: "low", label: "Low", defaultColor: "#22c55e" },
]

export default function SystemSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Manage application-wide configurations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Administrator Settings</AlertTitle>
          <AlertDescription>
            These settings affect all users of the Audit Platform. Proceed with caution.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold">Risk Configuration</h3>
          <p className="text-sm text-muted-foreground">Define labels and color codes for risk levels.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {riskLevels.map((level) => (
              <div key={level.id} className="space-y-2">
                <Label htmlFor={`risk-${level.id}`}>{level.label}</Label>
                <div className="flex items-center gap-2">
                  <Input id={`risk-${level.id}`} defaultValue={level.label} className="flex-grow" />
                  <Input
                    type="color"
                    defaultValue={level.defaultColor}
                    className="w-10 h-10 p-1"
                    aria-label={`${level.label} color`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold">Audit Templates</h3>
          <p className="text-sm text-muted-foreground">Manage templates for Findings and Reports.</p>
          <div className="flex gap-4">
            <Button variant="outline">Add New Template</Button>
            <Button variant="outline">Edit Existing</Button>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage all user accounts and their permissions.</p>
          <Link href="/stakeholders" passHref>
            <Button>Go to Stakeholder Management</Button>
          </Link>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save System Settings</Button>
      </CardFooter>
    </Card>
  )
}
