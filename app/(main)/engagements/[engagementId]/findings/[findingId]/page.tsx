// app/(main)/engagements/[engagementId]/findings/[findingId]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  AlertTriangle,
  Info,
  XCircle,
  Paperclip,
  Users,
  CalendarDays,
  Edit3,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Assuming you have Avatar

// --- Mock Data and Types ---
// In a real app, these types and data would come from a shared location or API
interface FindingDetail {
  id: string
  title: string
  engagementId: string
  status: "Open" | "Remediated" | "Closed" | "Risk Accepted"
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational"
  description: string
  recommendation: string
  managementResponse?: string
  assignedTo?: string // User ID or name
  assignedToAvatar?: string // URL for avatar
  dueDate?: string
  createdDate: string
  updatedDate: string
  evidenceLinks?: Array<{ name: string; url: string }>
  relatedControls?: string[]
  comments?: Array<{ user: string; avatar?: string; text: string; date: string }>
}

const mockFindingsData: FindingDetail[] = [
  {
    id: "FND-001",
    engagementId: "ENG-001", // Corresponds to "2025 Annual IT Security Audit"
    title: "Unpatched Production Server Vulnerability",
    status: "Open",
    severity: "Critical",
    description:
      "A critical vulnerability (CVE-2024-XXXX) was identified on server SRV-PROD-03, which has not been patched according to the latest security bulletin. This exposes the server to potential unauthorized access and data breach.",
    recommendation:
      "Immediately apply the latest security patches to SRV-PROD-03. Implement an automated patching schedule and verification process for all critical production servers.",
    managementResponse:
      "Patching process initiated. ETA for completion: 2025-07-15. Review of patching policy underway.",
    assignedTo: "Security Team Lead",
    assignedToAvatar: "/placeholder.svg?width=40&height=40",
    dueDate: "2025-07-20",
    createdDate: "2025-07-01",
    updatedDate: "2025-07-05",
    evidenceLinks: [{ name: "Vulnerability Scan Report SRV-PROD-03.pdf", url: "#" }],
    relatedControls: ["CM-02", "RA-05"],
    comments: [
      {
        user: "Yema al Olman",
        avatar: "/placeholder.svg?width=32&height=32",
        text: "Prioritizing this for immediate action.",
        date: "2025-07-02",
      },
      {
        user: "IT Operations",
        avatar: "/placeholder.svg?width=32&height=32",
        text: "Patch deployment scheduled for tonight.",
        date: "2025-07-05",
      },
    ],
  },
  {
    id: "FND-002",
    engagementId: "ENG-001",
    title: "Weak Password Policy for Admin Accounts",
    status: "Remediated",
    severity: "High",
    description:
      "The password policy for administrator accounts does not enforce sufficient complexity or regular rotation, increasing the risk of brute-force attacks.",
    recommendation:
      "Update the password policy to require a minimum of 16 characters, including uppercase, lowercase, numbers, and special symbols. Enforce password rotation every 90 days.",
    assignedTo: "IT Policy Manager",
    dueDate: "2025-06-15",
    createdDate: "2025-05-10",
    updatedDate: "2025-06-10",
    relatedControls: ["IA-02", "AC-03"],
  },
  // Add more mock findings as needed
]
// --- End Mock Data ---

const severityIcons = {
  Critical: <AlertTriangle className="h-5 w-5 text-red-500" />,
  High: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  Medium: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  Low: <Info className="h-5 w-5 text-blue-500" />,
  Informational: <Info className="h-5 w-5 text-gray-500" />,
}

const statusColors: Record<FindingDetail["status"], string> = {
  Open: "bg-red-500/10 text-red-700 border-red-500/50",
  Remediated: "bg-yellow-500/10 text-yellow-700 border-yellow-500/50",
  Closed: "bg-green-500/10 text-green-700 border-green-500/50",
  "Risk Accepted": "bg-blue-500/10 text-blue-700 border-blue-500/50",
}

export default function FindingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const engagementId = params.engagementId as string
  const findingId = params.findingId as string

  const [finding, setFinding] = useState<FindingDetail | null | undefined>(undefined) // undefined: loading, null: not found
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (engagementId && findingId) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const foundFinding = mockFindingsData.find((f) => f.id === findingId && f.engagementId === engagementId)
        setFinding(foundFinding || null)
        setIsLoading(false)
      }, 500)
    }
  }, [engagementId, findingId])

  if (isLoading || finding === undefined) {
    // This will be handled by loading.tsx for initial load,
    // but good for subsequent client-side loading states if any.
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p>Loading finding details...</p>
      </div>
    )
  }

  if (!finding) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Finding Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The finding with ID "{findingId}" for engagement "{engagementId}" could not be found.
        </p>
        <Button onClick={() => router.push(`/engagements/${engagementId}/dashboard`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Engagement Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/engagements/${engagementId}/dashboard`)}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Engagement
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            {severityIcons[finding.severity]}
            <span className="ml-2">{finding.title}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Finding ID: {finding.id} | Part of Engagement: {finding.engagementId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-sm px-3 py-1 ${statusColors[finding.status]}`}>{finding.status}</Badge>
          <Button variant="outline">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Finding
          </Button>
          {/* Add more actions like export, assign, etc. in a DropdownMenu if needed */}
        </div>
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{finding.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{finding.recommendation}</p>
            </CardContent>
          </Card>

          {finding.managementResponse && (
            <Card>
              <CardHeader>
                <CardTitle>Management Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{finding.managementResponse}</p>
              </CardContent>
            </Card>
          )}

          {finding.comments && finding.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Discussion / Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {finding.comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                      <AvatarFallback>{comment.user.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{comment.user}</p>
                        <p className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severity:</span>
                <Badge
                  variant={
                    finding.severity === "Critical"
                      ? "destructive"
                      : finding.severity === "High"
                        ? "destructive"
                        : // Or a custom orange
                          finding.severity === "Medium"
                          ? "warning"
                          : // shadcn warning is often yellow
                            "outline" // Low or Informational
                  }
                  className="capitalize"
                >
                  {severityIcons[finding.severity]} <span className="ml-1">{finding.severity}</span>
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={statusColors[finding.status]}>{finding.status}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Assigned To:
                </span>
                {finding.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={finding.assignedToAvatar || "/placeholder.svg"} alt={finding.assignedTo} />
                      <AvatarFallback>{finding.assignedTo.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span>{finding.assignedTo}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not Assigned</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Due Date:
                </span>
                <span>{finding.dueDate ? new Date(finding.dueDate).toLocaleDateString() : "N/A"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(finding.createdDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(finding.updatedDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {finding.relatedControls && finding.relatedControls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                  Related Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {finding.relatedControls.map((control) => (
                  <Badge key={control} variant="secondary">
                    {control}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {finding.evidenceLinks && finding.evidenceLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Paperclip className="mr-2 h-5 w-5 text-primary" />
                  Attached Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {finding.evidenceLinks.map((link) => (
                  <Button key={link.name} variant="link" className="p-0 h-auto text-sm justify-start" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
