import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  ShieldAlert,
  ListChecks,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  CalendarDays,
  Tag,
  User,
  Clock,
  Info,
} from "lucide-react"
import Link from "next/link"

// Define types for better structure
type RiskStatus = "Open" | "Closed" | "Mitigated" | "Accepted"
type RiskLevel = "Low" | "Medium" | "High" | "Critical"
type ControlStatus = "Effective" | "Partially Effective" | "Ineffective" | "Not Implemented"

interface Control {
  id: string
  name: string
  status: ControlStatus
  description?: string
}

interface ActivityLogEntry {
  id: string
  user: string
  action: string
  timestamp: string
  details?: string
}

interface RiskDetails {
  id: string
  title: string
  description: string
  status: RiskStatus
  inherentRisk: RiskLevel
  residualRisk: RiskLevel
  categories: string[]
  lastUpdated: string
  mitigatingControls: Control[]
  activityLog: ActivityLogEntry[]
}

// Mock data for the "Data Breach due to Unpatched System" risk
const mockRiskData: RiskDetails = {
  id: "risk-001",
  title: "Data Breach due to Unpatched System",
  description:
    "Potential for unauthorized access, modification, or exfiltration of sensitive company and customer data due to delays in applying critical security patches to key information systems and applications. This could lead to significant financial loss, reputational damage, and regulatory penalties.",
  status: "Open",
  inherentRisk: "Critical",
  residualRisk: "High",
  categories: ["Operational", "Enterprise", "Cybersecurity", "IT"],
  lastUpdated: "2025-05-28",
  mitigatingControls: [
    {
      id: "ctrl-001",
      name: "Quarterly Vulnerability Scanning",
      status: "Effective",
      description: "Regular scans to identify system vulnerabilities.",
    },
    {
      id: "ctrl-002",
      name: "Automated Patch Management Policy",
      status: "Partially Effective",
      description: "Policy and system for automated patching, currently facing some deployment challenges.",
    },
    {
      id: "ctrl-003",
      name: "Incident Response Plan for Data Breaches",
      status: "Effective",
      description: "Documented plan for responding to data breach incidents.",
    },
  ],
  activityLog: [
    {
      id: "act-001",
      user: "Yema al Olman",
      action: "Risk created",
      timestamp: "2025-05-20",
      details: "Initial assessment based on Q1 vulnerability report.",
    },
    {
      id: "act-002",
      user: "Khaled M.",
      action: "Status changed to Open",
      timestamp: "2025-05-21",
    },
    {
      id: "act-003",
      user: "System",
      action: "Control 'Automated Patch Management Policy' linked",
      timestamp: "2025-05-22",
    },
    {
      id: "act-004",
      user: "Fatima H.",
      action: "Residual risk assessed as High",
      timestamp: "2025-05-28",
      details: "Assessment after considering existing controls.",
    },
  ],
}

const getRiskLevelBadgeVariant = (level: RiskLevel) => {
  switch (level) {
    case "Critical":
      return "destructive"
    case "High":
      return "destructive" // Or a specific 'high' variant if defined
    case "Medium":
      return "secondary" // Or 'warning'
    case "Low":
      return "default" // Or 'success'
    default:
      return "outline"
  }
}

const getControlStatusBadgeVariant = (status: ControlStatus) => {
  switch (status) {
    case "Effective":
      return "default" // Or 'success'
    case "Partially Effective":
      return "secondary" // Or 'warning'
    case "Ineffective":
      return "destructive"
    case "Not Implemented":
      return "outline"
    default:
      return "outline"
  }
}

export default function RiskDetailPage({ params }: { params: { riskId: string } }) {
  // In a real app, you would fetch riskData based on params.riskId
  const riskData = mockRiskData

  if (!riskData) {
    return <div>Risk not found.</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{riskData.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/risks/${riskData.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Risk
            </Link>
          </Button>
          <Button variant="outline">
            <ListChecks className="mr-2 h-4 w-4" /> Manage Controls
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Archive Risk</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-700/20">
                Delete Risk
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md border">
            <Info className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={riskData.status === "Open" ? "secondary" : "default"}>{riskData.status}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md border">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Inherent Risk</p>
              <Badge variant={getRiskLevelBadgeVariant(riskData.inherentRisk)}>{riskData.inherentRisk}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md border">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Residual Risk</p>
              <Badge variant={getRiskLevelBadgeVariant(riskData.residualRisk)}>{riskData.residualRisk}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Card (takes 2 columns on lg screens) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{riskData.description}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {riskData.categories.map((category) => (
                  <Badge key={category} variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {new Date(riskData.lastUpdated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log Card (takes 1 column on lg screens) */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Timeline of changes to this risk.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {riskData.activityLog.slice(0, 5).map(
                (
                  activity, // Show latest 5
                ) => (
                  <li key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0 pt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}
                      </p>
                      {activity.details && <p className="text-xs text-muted-foreground">{activity.details}</p>}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(activity.timestamp).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </li>
                ),
              )}
            </ul>
            {riskData.activityLog.length > 5 && (
              <Button variant="link" size="sm" className="mt-4 w-full">
                View All Activity
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Associated Controls Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mitigating Controls</CardTitle>
            <CardDescription>Controls in place to mitigate this risk.</CardDescription>
          </div>
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Control
          </Button>
        </CardHeader>
        <CardContent>
          {riskData.mitigatingControls.length > 0 ? (
            <ul className="space-y-3">
              {riskData.mitigatingControls.map((control) => (
                <li key={control.id} className="p-3 border rounded-md hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{control.name}</h4>
                      {control.description && (
                        <p className="text-sm text-muted-foreground mt-1">{control.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <Badge variant={getControlStatusBadgeVariant(control.status)}>{control.status}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Control</span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No mitigating controls linked to this risk yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
