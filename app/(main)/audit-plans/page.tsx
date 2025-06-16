"use client"

import type React from "react" // Ensure 'type' import for React if only types are used from it directly
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Rocket,
  CheckCircle2,
  XCircleIcon,
  Hourglass,
  List,
  CalendarDays,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DatePicker } from "@/components/ui/date-picker"
import AuditPlansTimelineView from "./_components/audit-plans-timeline-view"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type AuditPlanStatus = "Draft" | "In Progress" | "Pending Review" | "Completed" | "Cancelled"

interface AuditPlan {
  id: string
  title: string
  objectives: string
  scope: string
  status: AuditPlanStatus
  startDate: Date
  endDate: Date
  personnel: string[]
  progress: number
  lastUpdated: string
}

export interface Assignment {
  id: string
  name: string
  auditPlanId: string
  startDate: Date
  endDate: Date
  status: "Not Started" | "In Progress" | "Completed" | "Overdue" | "Blocked"
  assignees?: string[]
  dependencies?: string[]
}

const initialMockAuditPlans: AuditPlan[] = [
  {
    id: "AP001",
    title: "Financial Statement Audit FY2024",
    objectives: "Verify accuracy of financial statements and compliance with accounting standards.",
    scope: "All financial transactions, balance sheets, income statements for FY2024.",
    status: "In Progress",
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-09-30"),
    personnel: ["Ahmed K.", "Fatima Z."],
    progress: 65,
    lastUpdated: "2025-06-01",
  },
  {
    id: "AP002",
    title: "IT General Controls Review Q3 2024",
    objectives: "Assess effectiveness of IT general controls.",
    scope: "Key IT systems and infrastructure.",
    status: "Pending Review",
    startDate: new Date("2024-08-15"),
    endDate: new Date("2024-09-15"),
    personnel: ["Yusuf A.", "Layla M."],
    progress: 90,
    lastUpdated: "2025-05-28",
  },
  {
    id: "AP003",
    title: "Operational Efficiency Audit - Mfg",
    objectives: "Identify areas for improvement in manufacturing processes.",
    scope: "All manufacturing plants.",
    status: "Draft",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-12-31"),
    personnel: ["Omar B."],
    progress: 10,
    lastUpdated: "2025-05-20",
  },
  {
    id: "AP004",
    title: "Compliance Audit - Data Privacy 2024",
    objectives: "Ensure adherence to data privacy regulations.",
    scope: "All departments handling PII.",
    status: "Completed",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-05-31"),
    personnel: ["Sara N.", "Khalid R."],
    progress: 100,
    lastUpdated: "2025-04-15",
  },
  {
    id: "AP006",
    title: "2025 Q3 Internal Controls Audit",
    objectives: "Annual review of internal control systems for Q3 2025.",
    scope: "Financial reporting, IT systems, operational processes.",
    status: "In Progress",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-09-30"),
    personnel: ["Aisha B.", "Bilal C."],
    progress: 20,
    lastUpdated: "2025-06-10",
  },
  {
    id: "AP007",
    title: "Cybersecurity Maturity Assessment 2025",
    objectives: "Assess current cybersecurity posture and identify gaps.",
    scope: "All IT infrastructure, applications, and data assets.",
    status: "Draft",
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-11-30"),
    personnel: ["Fatima Z.", "Yusuf A."],
    progress: 5,
    lastUpdated: "2025-06-15",
  },
]

export const mockAssignments: Assignment[] = [
  {
    id: "ASGN001",
    name: "Planning & Scoping",
    auditPlanId: "AP006",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-15"),
    status: "Completed",
    assignees: ["Aisha B."],
  },
  {
    id: "ASGN002",
    name: "Fieldwork - Financials",
    auditPlanId: "AP006",
    startDate: new Date("2025-07-16"),
    endDate: new Date("2025-08-15"),
    status: "In Progress",
    assignees: ["Bilal C."],
    dependencies: ["ASGN001"],
  },
  {
    id: "ASGN003",
    name: "Fieldwork - IT Systems",
    auditPlanId: "AP006",
    startDate: new Date("2025-07-20"),
    endDate: new Date("2025-08-20"),
    status: "In Progress",
    assignees: ["Aisha B."],
    dependencies: ["ASGN001"],
  },
  {
    id: "ASGN004",
    name: "Draft Reporting",
    auditPlanId: "AP006",
    startDate: new Date("2025-08-21"),
    endDate: new Date("2025-09-10"),
    status: "Not Started",
    assignees: ["Bilal C."],
    dependencies: ["ASGN002", "ASGN003"],
  },
  {
    id: "ASGN005",
    name: "Final Review & Submission",
    auditPlanId: "AP006",
    startDate: new Date("2025-09-11"),
    endDate: new Date("2025-09-30"),
    status: "Not Started",
    assignees: ["Aisha B."],
    dependencies: ["ASGN004"],
  },
  {
    id: "ASGN006",
    name: "Risk Identification",
    auditPlanId: "AP007",
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-08-30"),
    status: "Not Started",
    assignees: ["Fatima Z."],
  },
  {
    id: "ASGN007",
    name: "Vulnerability Scanning",
    auditPlanId: "AP007",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-09-30"),
    status: "Not Started",
    assignees: ["Yusuf A."],
    dependencies: ["ASGN006"],
  },
  {
    id: "ASGN008",
    name: "Penetration Testing",
    auditPlanId: "AP007",
    startDate: new Date("2025-10-01"),
    endDate: new Date("2025-10-31"),
    status: "Not Started",
    assignees: ["Fatima Z."],
    dependencies: ["ASGN007"],
  },
  {
    id: "ASGN009",
    name: "Report Compilation",
    auditPlanId: "AP007",
    startDate: new Date("2025-11-01"),
    endDate: new Date("2025-11-30"),
    status: "Not Started",
    assignees: ["Yusuf A."],
    dependencies: ["ASGN008"],
  },
  {
    id: "ASGN010",
    name: "AP001 - FY25 Kick-off",
    auditPlanId: "AP001",
    startDate: new Date("2025-06-20"),
    endDate: new Date("2025-07-05"),
    status: "In Progress",
    assignees: ["Ahmed K."],
  },
  {
    id: "ASGN011",
    name: "AP001 - FY25 Testing",
    auditPlanId: "AP001",
    startDate: new Date("2025-07-06"),
    endDate: new Date("2025-08-15"),
    status: "Not Started",
    assignees: ["Fatima Z."],
    dependencies: ["ASGN010"],
  },
]

const statusConfig: Record<
  AuditPlanStatus,
  { icon: React.ElementType; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" | "info" }
> = {
  Draft: { icon: FileText, color: "text-gray-500", badgeVariant: "outline" },
  "In Progress": { icon: Rocket, color: "text-sky-600", badgeVariant: "info" },
  "Pending Review": { icon: Hourglass, color: "text-yellow-600", badgeVariant: "secondary" },
  Completed: { icon: CheckCircle2, color: "text-green-600", badgeVariant: "default" },
  Cancelled: { icon: XCircleIcon, color: "text-red-600", badgeVariant: "destructive" },
}

export default function AuditPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [auditPlans, setAuditPlans] = useState<AuditPlan[]>(initialMockAuditPlans)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<AuditPlan | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list")

  const [currentTitle, setCurrentTitle] = useState("")
  const [currentObjectives, setCurrentObjectives] = useState("")
  const [currentScope, setCurrentScope] = useState("")
  const [currentStatus, setCurrentStatus] = useState<AuditPlanStatus>("Draft")
  const [currentStartDate, setCurrentStartDate] = useState<Date | undefined>(new Date())
  const [currentEndDate, setCurrentEndDate] = useState<Date | undefined>()
  const [currentPersonnel, setCurrentPersonnel] = useState("")

  const filteredAuditPlans = useMemo(() => {
    if (!searchTerm) return auditPlans
    return auditPlans.filter(
      (plan) =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.objectives.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.personnel.join(", ").toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, auditPlans])

  const openAddPlanForm = () => {
    setEditingPlan(null)
    setCurrentTitle("")
    setCurrentObjectives("")
    setCurrentScope("")
    setCurrentStatus("Draft")
    setCurrentStartDate(new Date())
    setCurrentEndDate(undefined)
    setCurrentPersonnel("")
    setIsFormOpen(true)
  }

  const openEditPlanForm = (plan: AuditPlan) => {
    setEditingPlan(plan)
    setCurrentTitle(plan.title)
    setCurrentObjectives(plan.objectives)
    setCurrentScope(plan.scope)
    setCurrentStatus(plan.status)
    setCurrentStartDate(plan.startDate)
    setCurrentEndDate(plan.endDate)
    setCurrentPersonnel(plan.personnel.join(", "))
    setIsFormOpen(true)
  }

  const handleDeletePlan = (planId: string) => {
    setAuditPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId))
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const planData: Omit<AuditPlan, "id" | "progress" | "lastUpdated"> = {
      title: currentTitle,
      objectives: currentObjectives,
      scope: currentScope,
      status: currentStatus,
      startDate: currentStartDate || new Date(), // Ensure date is not undefined
      endDate: currentEndDate || new Date(), // Ensure date is not undefined
      personnel: currentPersonnel
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    }

    if (editingPlan) {
      setAuditPlans((prevPlans) =>
        prevPlans.map((p) =>
          p.id === editingPlan.id
            ? { ...editingPlan, ...planData, lastUpdated: new Date().toISOString().split("T")[0] }
            : p,
        ),
      )
    } else {
      const newPlan: AuditPlan = {
        ...planData,
        id: `AP${String(auditPlans.length + 1).padStart(3, "0")}`,
        progress: 0,
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setAuditPlans((prevPlans) => [...prevPlans, newPlan])
    }
    setIsFormOpen(false)
  }

  const timelineStartDate = new Date("2025-06-16")
  const timelineEndDate = new Date("2025-12-31")

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Manage Audit Plans</h1>
        </div>

        <Tabs defaultValue="listAndTimeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid sm:grid-cols-[auto_auto] mb-6">
            <TabsTrigger value="listAndTimeline">List & Timeline</TabsTrigger>
            <TabsTrigger value="resourceWorkload">Resource Workload</TabsTrigger>
          </TabsList>

          <TabsContent value="listAndTimeline">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openAddPlanForm} className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-5 w-5" /> Add New Audit Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingPlan ? "Edit Audit Plan" : "Add New Audit Plan"}</DialogTitle>
                      <DialogDescription>
                        {editingPlan
                          ? "Update the details of the existing audit plan."
                          : "Specify objectives, scope, timeline, and personnel for the new audit plan."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit}>
                      <ScrollArea className="max-h-[70vh] p-1">
                        <div className="grid gap-4 py-4 pr-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Plan Title
                            </Label>
                            <Input
                              id="title"
                              value={currentTitle}
                              onChange={(e) => setCurrentTitle(e.target.value)}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="objectives" className="text-right pt-2">
                              Objectives
                            </Label>
                            <Textarea
                              id="objectives"
                              value={currentObjectives}
                              onChange={(e) => setCurrentObjectives(e.target.value)}
                              className="col-span-3 min-h-[80px]"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="scope" className="text-right pt-2">
                              Scope
                            </Label>
                            <Textarea
                              id="scope"
                              value={currentScope}
                              onChange={(e) => setCurrentScope(e.target.value)}
                              className="col-span-3 min-h-[80px]"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <select
                              id="status"
                              value={currentStatus}
                              onChange={(e) => setCurrentStatus(e.target.value as AuditPlanStatus)}
                              className="col-span-3 p-2 border rounded-md bg-background"
                            >
                              {Object.keys(statusConfig).map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right">
                              Start Date
                            </Label>
                            <DatePicker date={currentStartDate} setDate={setCurrentStartDate} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDate" className="text-right">
                              End Date
                            </Label>
                            <DatePicker date={currentEndDate} setDate={setCurrentEndDate} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="personnel" className="text-right">
                              Personnel
                            </Label>
                            <Input
                              id="personnel"
                              value={currentPersonnel}
                              onChange={(e) => setCurrentPersonnel(e.target.value)}
                              className="col-span-3"
                              placeholder="Comma-separated names, e.g., John D, Jane S"
                            />
                          </div>
                        </div>
                      </ScrollArea>
                      <DialogFooter className="pt-4 pr-4">
                        <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">{editingPlan ? "Save Changes" : "Create Plan"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center rounded-md bg-muted p-0.5">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3 py-1.5 h-auto"
                  >
                    <List className="mr-2 h-4 w-4" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === "timeline" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("timeline")}
                    className="px-3 py-1.5 h-auto"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Timeline
                  </Button>
                </div>
              </div>

              {viewMode === "list" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Plan Overview</CardTitle>
                    <CardDescription>A list of all ongoing and planned audits.</CardDescription>
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-full sm:flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search plans by title, objectives, or personnel..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Plan Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Personnel</TableHead>
                            <TableHead className="w-[150px]">Progress</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAuditPlans.length > 0 ? (
                            filteredAuditPlans.map((plan) => {
                              const config = statusConfig[plan.status]
                              const StatusIcon = config.icon
                              const statusColor = config.color
                              const badgeVariant = config.badgeVariant

                              let progressColor = "bg-sky-500"
                              if (plan.status === "Completed") progressColor = "bg-green-500"
                              else if (plan.status === "Pending Review") progressColor = "bg-yellow-500"
                              else if (plan.status === "Draft") progressColor = "bg-gray-400"
                              else if (plan.status === "Cancelled") progressColor = "bg-red-500"

                              return (
                                <TableRow key={plan.id}>
                                  <TableCell>
                                    <div className="font-medium truncate w-60" title={plan.title}>
                                      {plan.title}
                                    </div>
                                    <div
                                      className="text-xs text-muted-foreground truncate w-60"
                                      title={plan.objectives}
                                    >
                                      {plan.objectives}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={badgeVariant}
                                      className={
                                        plan.status === "Completed"
                                          ? "bg-green-500 hover:bg-green-600 text-white"
                                          : plan.status === "In Progress"
                                            ? "bg-sky-100 hover:bg-sky-200 text-sky-700 border-sky-300"
                                            : "" // Ensure other statuses have appropriate default or specific styles
                                      }
                                    >
                                      <StatusIcon className={`mr-1.5 h-3.5 w-3.5 ${statusColor}`} />
                                      {plan.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col text-xs">
                                      <span>Start: {plan.startDate.toLocaleDateString()}</span>
                                      <span>End: {plan.endDate.toLocaleDateString()}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex -space-x-2 overflow-hidden">
                                      {plan.personnel.slice(0, 3).map((p, i) => (
                                        <Tooltip key={i}>
                                          <TooltipTrigger asChild>
                                            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-background bg-muted-foreground text-muted text-xs flex items-center justify-center cursor-default">
                                              {p.substring(0, 1).toUpperCase()}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>{p}</TooltipContent>
                                        </Tooltip>
                                      ))}
                                      {plan.personnel.length > 3 && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-background bg-primary text-primary-foreground text-xs flex items-center justify-center cursor-default">
                                              +{plan.personnel.length - 3}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>{plan.personnel.slice(3).join(", ")}</TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                    {plan.personnel.length === 0 && (
                                      <span className="text-xs text-muted-foreground">N/A</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Progress
                                        value={plan.progress}
                                        className="h-2 flex-grow"
                                        indicatorClassName={progressColor}
                                      />
                                      <span className="text-xs text-muted-foreground">{plan.progress}%</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-5 w-5" />
                                          <span className="sr-only">Actions</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => console.log("View details for", plan.id)}>
                                          <Eye className="mr-2 h-4 w-4" /> View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openEditPlanForm(plan)}>
                                          <Edit3 className="mr-2 h-4 w-4" /> Edit Plan
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={() => handleDeletePlan(plan.id)}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" /> Delete Plan
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                No audit plans found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <AuditPlansTimelineView
                  auditPlans={filteredAuditPlans}
                  assignments={mockAssignments}
                  timelineStartDate={timelineStartDate}
                  timelineEndDate={timelineEndDate}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="resourceWorkload">
            <Card>
              <CardHeader>
                <CardTitle>Resource Workload</CardTitle>
                <CardDescription>Visualize team member allocation and availability.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Resource workload content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
