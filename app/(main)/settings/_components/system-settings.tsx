"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Users, Palette, FileText, LinkIcon } from "lucide-react" // Added Link from lucide-react
import NextLink from "next/link" // Use NextLink for navigation

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
        <CardDescription>Manage application-wide configurations. (Admin Access Required)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Administrator Settings</AlertTitle>
          <AlertDescription>
            These settings affect all users of the Audit Platform. Proceed with caution. Only users with administrative
            privileges can modify these settings.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Risk Configuration</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Define labels and color codes for risk levels used across the platform.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {riskLevels.map((level) => (
              <div key={level.id} className="space-y-2">
                <Label htmlFor={`risk-${level.id}`}>{level.label}</Label>
                <div className="flex items-center gap-2">
                  <Input id={`risk-${level.id}`} defaultValue={level.label} className="flex-grow" />
                  <Input
                    type="color"
                    defaultValue={level.defaultColor}
                    className="w-10 h-10 p-1 rounded-md cursor-pointer"
                    aria-label={`${level.label} color`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Audit Templates</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage standardized templates for Findings, Reports, and Audit Plans.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline">Manage Finding Templates</Button>
            <Button variant="outline">Manage Report Templates</Button>
            <Button variant="outline">Manage Audit Plan Templates</Button>
          </div>
        </div>

        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">User & Role Management</h3>
          </div>
          <p className="text-sm text-muted-foreground">Administer user accounts, roles, and permissions.</p>
          <div className="pt-2">
            <NextLink href="/stakeholders" passHref legacyBehavior>
              <Button asChild>
                <a>
                  <LinkIcon className="mr-2 h-4 w-4" /> Go to Stakeholder Management
                </a>
              </Button>
            </NextLink>
          </div>
        </div>

        {/* Placeholder for Data Retention & Backup Policy */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">Data Retention & Backup</h3>
          <p className="text-sm text-muted-foreground">
            Configure data retention policies and manage system backups. (Coming Soon)
          </p>
        </div>

        {/* Placeholder for API & Integrations */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">API & Integrations</h3>
          <p className="text-sm text-muted-foreground">
            Manage API keys and configure third-party integrations. (Coming Soon)
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save System Settings</Button>
      </CardFooter>
    </Card>
  )
}
