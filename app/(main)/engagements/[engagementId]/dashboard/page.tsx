"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link" // Import Link

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  AlertOctagon,
  Clock,
  DollarSign,
  Target,
  User,
  Calendar,
  FileText,
  Briefcase,
  Search,
  Paperclip,
  ChevronRight,
  Archive,
  LayoutDashboard,
  AlertTriangle,
  PlusCircle,
} from "lucide-react"

// --- Enhanced Mock Data and Types ---
interface HealthMetric {
  value: string | number
  label: string
  icon: React.ElementType
  variant?: "default" | "warning" | "critical"
}

interface LinkedItem {
  id: string
  title: string
  status?: string // e.g., for Assignments
  severity?: string // e.g., for Findings
  type?: string // e.g., for Evidence
  date?: string
}

interface EngagementData {
  id: string
  title: string
  status: "Planning" | "In Progress" | "In Review" | "Completed" | "On Hold"
  healthMetrics: {
    progress: number
    openHighRiskFindings: number
    overdueTasks: number
    budgetConsumed: number // percentage
    budgetTotal: number // currency amount
  }
  details: {
    primaryStakeholder: string
    engagementManager: string
    startDate: string
    endDate: string
    objective: string
  }
  linkedItems: {
    assignments: LinkedItem[]
    findings: LinkedItem[]
    evidence: LinkedItem[]
  }
}

const mockEngagementData: EngagementData = {
  id: "ENG-001",
  title: "2025 Annual IT Security Audit",
  status: "In Progress",
  healthMetrics: {
    progress: 60,
    openHighRiskFindings: 2,
    overdueTasks: 5,
    budgetConsumed: 70, // 70%
    budgetTotal: 50000,
  },
  details: {
    primaryStakeholder: "IT Department",
    engagementManager: "Yema al Olman",
    startDate: "2025-02-01",
    endDate: "2025-05-31",
    objective:
      "To assess the effectiveness of IT security controls, identify vulnerabilities, and ensure compliance with relevant regulations and internal policies. This audit will cover network infrastructure, data security, access controls, and incident response capabilities.",
  },
  linkedItems: {
    assignments: [
      { id: "ASGN-001", title: "Risk Assessment & Scoping", status: "Completed", date: "2025-02-15" },
      { id: "ASGN-002", title: "Control Testing - Network", status: "In Progress", date: "2025-03-10" },
      { id: "ASGN-003", title: "Control Testing - Data Security", status: "Pending", date: "2025-03-25" },
      { id: "ASGN-004", title: "Reporting & Documentation", status: "Pending", date: "2025-04-15" },
    ],
    findings: [
      { id: "FIND-001", title: "Weak Password Policy Enforcement", severity: "High", date: "2025-03-05" },
      {
        id: "FIND-002",
        title: "Unpatched Server Vulnerability (CVE-2024-XXXX)",
        severity: "Critical",
        date: "2025-03-08",
      },
      { id: "FIND-003", title: "Insufficient Access Logging", severity: "Medium", date: "2025-03-12" },
    ],
    evidence: [
      { id: "EVID-001", title: "Security Policy Document v2.3", type: "Document", date: "2025-02-05" },
      { id: "EVID-002", title: "Server Patch Logs - Feb 2025", type: "Log File", date: "2025-03-01" },
      { id: "EVID-003", title: "Access Control Review Checklist", type: "Checklist", date: "2025-02-20" },
    ],
  },
}
// --- End of Mock Data ---

export default function EngagementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const engagementId = params.engagementId as string // This is the main engagement ID from the URL

  const [engagement, setEngagement] = useState<EngagementData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (engagementId) {
      setIsLoading(true)
      // Simulate API call to fetch data for this specific engagementId
      // In a real app, you'd fetch based on engagementId. Here, we use the mock if ID matches.
      setTimeout(() => {
        if (engagementId === mockEngagementData.id) {
          setEngagement(mockEngagementData)
        } else {
          setEngagement(null) // Or handle as "not found"
        }
        setIsLoading(false)
      }, 500)
    }
  }, [engagementId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Loading engagement details...</p>
      </div>
    )
  }

  if (!engagement) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Engagement Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find an engagement with ID: <strong>{engagementId}</strong>.
        </p>
        <Button asChild variant="outline">
          <Link href="/engagements">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Engagements
          </Link>
        </Button>
      </div>
    )
  }

  const getStatusBadgeColor = (status: EngagementData["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "In Review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "On Hold":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const healthMetricsDisplay: HealthMetric[] = [
    {
      value: `${engagement.healthMetrics.openHighRiskFindings}`,
      label: "Open High-Risk Findings",
      icon: AlertOctagon,
      variant: engagement.healthMetrics.openHighRiskFindings > 0 ? "critical" : "default",
    },
    {
      value: `${engagement.healthMetrics.overdueTasks}`,
      label: "Overdue Tasks",
      icon: Clock,
      variant: engagement.healthMetrics.overdueTasks > 0 ? "warning" : "default",
    },
  ]

  const handleEditEngagement = () => {
    router.push(`/engagements/${engagement.id}/edit`)
  }

  const getLinkedItemIcon = (type: string | undefined, itemType: "assignments" | "findings" | "evidence") => {
    if (itemType === "assignments") return Briefcase
    if (itemType === "findings") return Search
    if (itemType === "evidence") {
      if (type?.toLowerCase().includes("document")) return FileText
      return Paperclip
    }
    return FileText
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/engagements">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Engagements</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{engagement.title}</h1>
            <Badge variant="outline" className={`mt-1 ${getStatusBadgeColor(engagement.status)}`}>
              {engagement.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEditEngagement}>
            <Edit className="mr-2 h-4 w-4" /> Edit Engagement
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("View Full Dashboard (Conceptual)")}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> View Full Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Generate Report action")}>
                <FileText className="mr-2 h-4 w-4" /> Generate Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:!text-red-600 focus:!text-red-600"
                onClick={() => confirm("Are you sure you want to archive this engagement?") && alert("Archive action")}
              >
                <Archive className="mr-2 h-4 w-4" /> Archive Engagement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Engagement Health Dashboard Section */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Health</CardTitle>
          <CardDescription>At-a-glance overview of key performance indicators.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-semibold">{engagement.healthMetrics.progress}%</span>
            </div>
            <Progress value={engagement.healthMetrics.progress} className="h-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pt-4">
            {healthMetricsDisplay.map((metric) => (
              <Card
                key={metric.label}
                className={
                  metric.variant === "critical"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                    : metric.variant === "warning"
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30"
                      : ""
                }
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <metric.icon
                    className={`h-6 w-6 ${
                      metric.variant === "critical"
                        ? "text-red-600"
                        : metric.variant === "warning"
                          ? "text-yellow-600"
                          : "text-primary"
                    }`}
                  />
                  <div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    $
                    {(
                      (engagement.healthMetrics.budgetConsumed / 100) *
                      engagement.healthMetrics.budgetTotal
                    ).toLocaleString()}
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / ${engagement.healthMetrics.budgetTotal.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Budget vs. Actual ({engagement.healthMetrics.budgetConsumed}%)
                  </p>
                </div>
              </CardContent>
              <div className="px-4 pb-2">
                <Progress
                  value={engagement.healthMetrics.budgetConsumed}
                  className={`h-2 ${
                    engagement.healthMetrics.budgetConsumed > 85
                      ? "bg-red-500"
                      : engagement.healthMetrics.budgetConsumed > 60
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                />
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid (Details & Linked Items) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Details Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Engagement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start">
              <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Primary Stakeholder:</span>
                <p className="text-muted-foreground">{engagement.details.primaryStakeholder}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Engagement Manager:</span>
                <p className="text-muted-foreground">{engagement.details.engagementManager}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Dates:</span>
                <p className="text-muted-foreground">
                  Start: {new Date(engagement.details.startDate).toLocaleDateString()} <br />
                  End: {new Date(engagement.details.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Target className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Objective:</span>
                <p className="text-muted-foreground leading-relaxed">{engagement.details.objective}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linked Items Tabs */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="assignments" className="h-full flex flex-col">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Linked Items</CardTitle>
                {/* "Create New Finding" button added here, visible when Findings tab is active or always */}
                {/* This example shows it always, adjust with activeTab state if needed */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="ml-auto" // Pushes button to the right
                >
                  <Link href={`/engagements/${engagementId}/findings/new`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Finding
                  </Link>
                </Button>
              </div>
              <TabsList className="grid w-full grid-cols-3 mt-2">
                <TabsTrigger value="assignments">Assignments ({engagement.linkedItems.assignments.length})</TabsTrigger>
                <TabsTrigger value="findings">Findings ({engagement.linkedItems.findings.length})</TabsTrigger>
                <TabsTrigger value="evidence">Evidence ({engagement.linkedItems.evidence.length})</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-0 flex-grow">
              <TabsContent value="assignments" className="mt-4 space-y-2">
                {engagement.linkedItems.assignments.map((item) => {
                  const ItemIcon = getLinkedItemIcon(item.status, "assignments")
                  return (
                    <Link key={item.id} href={`/engagements/${engagementId}/assignments/${item.id}`} passHref>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <ItemIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.status && (
                                <Badge variant="secondary" className="mr-1">
                                  {item.status}
                                </Badge>
                              )}
                              {item.date && `Due: ${new Date(item.date).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  )
                })}
                {engagement.linkedItems.assignments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No assignments linked.</p>
                )}
              </TabsContent>
              <TabsContent value="findings" className="mt-4 space-y-2">
                {engagement.linkedItems.findings.map((item) => {
                  const ItemIcon = getLinkedItemIcon(item.severity, "findings")
                  return (
                    <Link key={item.id} href={`/engagements/${engagementId}/findings/${item.id}`} passHref>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <ItemIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.severity && (
                                <Badge
                                  variant={
                                    item.severity === "Critical" || item.severity === "High" ? "destructive" : "outline"
                                  }
                                  className="mr-1"
                                >
                                  {item.severity}
                                </Badge>
                              )}
                              {item.date && `Identified: ${new Date(item.date).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  )
                })}
                {engagement.linkedItems.findings.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No findings linked.</p>
                )}
              </TabsContent>
              <TabsContent value="evidence" className="mt-4 space-y-2">
                {engagement.linkedItems.evidence.map((item) => {
                  const ItemIcon = getLinkedItemIcon(item.type, "evidence")
                  return (
                    <Link key={item.id} href={`/engagements/${engagementId}/evidence/${item.id}`} passHref>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <ItemIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.type && <span className="mr-1">{item.type}</span>}
                              {item.date && `Uploaded: ${new Date(item.date).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  )
                })}
                {engagement.linkedItems.evidence.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No evidence linked.</p>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
