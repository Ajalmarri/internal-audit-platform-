"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Edit3,
  MoreHorizontal,
  Archive,
  PlusCircle,
  Users,
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  LinkIcon,
  Target,
  FileText,
  Rocket,
  Hourglass,
  CheckCircle2,
  XCircleIcon,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation" // To handle plan not found
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types (can be moved to a shared types file)
type AuditPlanStatus = "Draft" | "In Progress" | "Pending Review" | "Completed" | "Cancelled"
type AssignmentStatus = "Not Started" | "In Progress" | "Completed" | "Blocked" | "Pending Review"

interface AuditPlan {
  id: string
  title: string
  objectives: string // Used as description
  scopeSummary: string // For the scope card intro
  status: AuditPlanStatus
  startDate: Date
  endDate: Date
  personnel: { id: string; name: string; avatarUrl?: string; role?: string }[]
  progress: number
  lastUpdated: string
}

interface Assignment {
  id: string
  name: string
  status: AssignmentStatus
  assignees: { id: string; name: string; avatarUrl?: string }[]
  dueDate: Date
  auditPlanId: string
}

interface RiskItem {
  id: string
  name: string
  description: string
}

interface ControlItem {
  id: string
  name: string
  description: string
}

// Mock Data
const mockAuditPlanAP001: AuditPlan = {
  id: "AP001",
  title: "Financial Statement Audit FY2024",
  objectives:
    "Verify accuracy of financial statements and compliance with accounting standards for the fiscal year 2024. This includes a thorough review of balance sheets, income statements, and cash flow statements.",
  scopeSummary:
    "The audit will cover all material financial transactions, internal controls over financial reporting (ICFR), and adherence to IFRS and local GAAP.",
  status: "In Progress",
  startDate: new Date("2024-08-01"),
  endDate: new Date("2024-10-01"),
  personnel: [
    { id: "user1", name: "Ahmed K.", avatarUrl: "/placeholder.svg?width=40&height=40", role: "Lead Auditor" },
    { id: "user2", name: "Fatima Z.", avatarUrl: "/placeholder.svg?width=40&height=40", role: "Senior Auditor" },
    { id: "user3", name: "Yusuf A.", avatarUrl: "/placeholder.svg?width=40&height=40", role: "Auditor" },
  ],
  progress: 40,
  lastUpdated: "2025-06-10",
}

const mockAssignmentsForAP001: Assignment[] = [
  {
    id: "ASGN001-AP001",
    name: "Planning & Risk Assessment",
    status: "Completed",
    assignees: [{ id: "user1", name: "Ahmed K." }],
    dueDate: new Date("2024-08-15"),
    auditPlanId: "AP001",
  },
  {
    id: "ASGN002-AP001",
    name: "Cash & Cash Equivalents Testing",
    status: "In Progress",
    assignees: [{ id: "user2", name: "Fatima Z." }],
    dueDate: new Date("2024-09-05"),
    auditPlanId: "AP001",
  },
  {
    id: "ASGN003-AP001",
    name: "Revenue Recognition Audit",
    status: "Not Started",
    assignees: [
      { id: "user3", name: "Yusuf A." },
      { id: "user1", name: "Ahmed K." },
    ],
    dueDate: new Date("2024-09-20"),
    auditPlanId: "AP001",
  },
  {
    id: "ASGN004-AP001",
    name: "ICFR Walkthroughs",
    status: "Pending Review",
    assignees: [{ id: "user2", name: "Fatima Z." }],
    dueDate: new Date("2024-09-10"),
    auditPlanId: "AP001",
  },
]

const mockRisksForAP001: RiskItem[] = [
  {
    id: "RISK001",
    name: "Material Misstatement in Financial Reports",
    description: "Risk of significant errors or omissions in the financial statements.",
  },
  {
    id: "RISK002",
    name: "Fraudulent Financial Reporting",
    description: "Risk of intentional misstatements or omissions of amounts or disclosures.",
  },
  {
    id: "RISK003",
    name: "Non-compliance with IFRS/GAAP",
    description: "Risk of financial statements not adhering to applicable accounting standards.",
  },
]

const mockControlsForAP001: ControlItem[] = [
  {
    id: "CTRL001",
    name: "Segregation of Duties",
    description: "Ensuring different individuals are responsible for different parts of a transaction.",
  },
  {
    id: "CTRL002",
    name: "Monthly Account Reconciliation",
    description: "Regular reconciliation of key accounts to identify discrepancies.",
  },
  {
    id: "CTRL003",
    name: "Management Review of Financials",
    description: "Periodic review of financial reports by management.",
  },
]

// Helper to get status badge styles
const getStatusConfig = (status: AuditPlanStatus | AssignmentStatus) => {
  switch (status) {
    case "Draft":
      return { icon: FileText, color: "bg-gray-100 text-gray-700 border-gray-300", label: "Draft" }
    case "In Progress":
      return { icon: Rocket, color: "bg-sky-100 text-sky-700 border-sky-300", label: "In Progress" }
    case "Pending Review":
      return { icon: Hourglass, color: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "Pending Review" }
    case "Completed":
      return { icon: CheckCircle2, color: "bg-green-100 text-green-700 border-green-300", label: "Completed" }
    case "Cancelled":
      return { icon: XCircleIcon, color: "bg-red-100 text-red-700 border-red-300", label: "Cancelled" }
    case "Not Started":
      return { icon: FileText, color: "bg-slate-100 text-slate-700 border-slate-300", label: "Not Started" }
    case "Blocked":
      return { icon: XCircleIcon, color: "bg-orange-100 text-orange-700 border-orange-300", label: "Blocked" }
    default:
      return { icon: FileText, color: "bg-gray-100 text-gray-700", label: status }
  }
}

export default function AuditPlanDetailPage({ params }: { params: { planId: string } }) {
  // In a real app, you'd fetch this data based on params.planId
  const auditPlan = params.planId === "AP001" ? mockAuditPlanAP001 : null
  const assignments = params.planId === "AP001" ? mockAssignmentsForAP001 : []
  const risks = params.planId === "AP001" ? mockRisksForAP001 : []
  const controls = params.planId === "AP001" ? mockControlsForAP001 : []

  if (!auditPlan) {
    notFound() // Or return a custom "Not Found" component
  }

  const planStatusConfig = getStatusConfig(auditPlan.status)
  const PlanStatusIcon = planStatusConfig.icon

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-foreground">{auditPlan.title}</h1>
          <Badge variant="outline" className={`text-sm ${planStatusConfig.color}`}>
            <PlanStatusIcon className="mr-1.5 h-4 w-4" />
            {planStatusConfig.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Plan
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" /> Archive Plan
              </DropdownMenuItem>
              <DropdownMenuItem>Generate Report</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete Plan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Plan Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Target className="mr-2 h-5 w-5 text-primary" /> Plan Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p className="text-foreground leading-relaxed">{auditPlan.objectives}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4" /> Personnel
              </h3>
              <div className="flex flex-wrap gap-2">
                {auditPlan.personnel.map((person) => (
                  <TooltipProvider key={person.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={person.avatarUrl || "/placeholder.svg"} alt={person.name} />
                          <AvatarFallback>{person.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{person.name}</p>
                        {person.role && <p className="text-xs text-muted-foreground">{person.role}</p>}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" /> Dates
              </h3>
              <p className="text-foreground">
                Start:{" "}
                {auditPlan.startDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </p>
              <p className="text-foreground">
                End:{" "}
                {auditPlan.endDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Progress</h3>
              <div className="flex items-center gap-2">
                <Progress value={auditPlan.progress} className="h-3 flex-grow" />
                <span className="text-lg font-semibold text-primary">{auditPlan.progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last updated: {auditPlan.lastUpdated}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked Assignments Card */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <ClipboardList className="mr-2 h-5 w-5 text-primary" /> Assignments
          </CardTitle>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Assignment
          </Button>
        </CardHeader>
        <CardContent>
          {assignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee(s)</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => {
                  const assignmentStatusConfig = getStatusConfig(assignment.status)
                  const AssignmentStatusIcon = assignmentStatusConfig.icon
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={assignmentStatusConfig.color}>
                          <AssignmentStatusIcon className="mr-1.5 h-3.5 w-3.5" />
                          {assignmentStatusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {assignment.assignees.map((person) => (
                            <TooltipProvider key={person.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="h-7 w-7 border-2 border-background">
                                    <AvatarImage src={person.avatarUrl || "/placeholder.svg"} alt={person.name} />
                                    <AvatarFallback>{person.name.substring(0, 1)}</AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>{person.name}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.dueDate.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/assignments/${assignment.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Assignment</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No assignments linked to this audit plan yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Scope: Risks & Controls Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Scope: Risks & Controls
          </CardTitle>
          <CardDescription>{auditPlan.scopeSummary}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Key Risks in Scope</h3>
            {risks.length > 0 ? (
              <ul className="space-y-2">
                {risks.map((risk) => (
                  <li key={risk.id} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <Link href={`/risks/${risk.id}`} className="flex items-center group">
                      <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <span className="font-medium text-foreground group-hover:text-primary">{risk.name}</span>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">{risk.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No specific risks identified in scope for this plan.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Key Controls to Assess</h3>
            {controls.length > 0 ? (
              <ul className="space-y-2">
                {controls.map((control) => (
                  <li key={control.id} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <Link href={`/controls/${control.id}`} className="flex items-center group">
                      <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <span className="font-medium text-foreground group-hover:text-primary">{control.name}</span>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">{control.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No specific controls identified for assessment in this plan.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
