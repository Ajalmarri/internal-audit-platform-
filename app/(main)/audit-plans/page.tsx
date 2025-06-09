"use client"

import type React from "react"
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
import { DatePicker } from "@/components/ui/date-picker" // Assuming a DatePicker component exists

type AuditPlanStatus = "Draft" | "In Progress" | "Pending Review" | "Completed" | "Cancelled"

interface AuditPlan {
  id: string
  title: string
  objectives: string
  scope: string
  status: AuditPlanStatus
  startDate: Date
  endDate: Date
  personnel: string[] // Array of names or IDs
  progress: number // 0-100
  lastUpdated: string
}

const mockAuditPlans: AuditPlan[] = [
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
    title: "IT General Controls Review Q3",
    objectives: "Assess effectiveness of IT general controls including access management and change control.",
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
    title: "Operational Efficiency Audit - Manufacturing",
    objectives: "Identify areas for improvement in manufacturing processes to enhance efficiency.",
    scope: "All manufacturing plants and related supply chain processes.",
    status: "Draft",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-12-31"),
    personnel: ["Omar B."],
    progress: 10,
    lastUpdated: "2025-05-20",
  },
  {
    id: "AP004",
    title: "Compliance Audit - Data Privacy",
    objectives: "Ensure adherence to data privacy regulations (e.g., GDPR, local laws).",
    scope: "All departments handling PII.",
    status: "Completed",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-05-31"),
    personnel: ["Sara N.", "Khalid R."],
    progress: 100,
    lastUpdated: "2025-04-15",
  },
  {
    id: "AP005",
    title: "Vendor Risk Management Audit",
    objectives: "Evaluate the effectiveness of the vendor risk management program.",
    scope: "Top 20 critical vendors and related contracts.",
    status: "Cancelled",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-07-31"),
    personnel: ["Ali H."],
    progress: 0,
    lastUpdated: "2025-03-10",
  },
]

const statusConfig: Record<
  AuditPlanStatus,
  { icon: React.ElementType; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }
> = {
  Draft: { icon: FileText, color: "text-gray-500", badgeVariant: "outline" },
  "In Progress": { icon: Rocket, color: "text-blue-500", badgeVariant: "default" }, // Using default for blue-ish
  "Pending Review": { icon: Hourglass, color: "text-yellow-600", badgeVariant: "secondary" }, // Using secondary for yellow-ish
  Completed: { icon: CheckCircle2, color: "text-green-500", badgeVariant: "default" }, // Using default with custom green class
  Cancelled: { icon: XCircleIcon, color: "text-red-500", badgeVariant: "destructive" },
}

export default function AuditPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [auditPlans, setAuditPlans] = useState<AuditPlan[]>(mockAuditPlans)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<AuditPlan | null>(null)

  // Form state
  const [currentTitle, setCurrentTitle] = useState("")
  const [currentObjectives, setCurrentObjectives] = useState("")
  const [currentScope, setCurrentScope] = useState("")
  const [currentStatus, setCurrentStatus] = useState<AuditPlanStatus>("Draft")
  const [currentStartDate, setCurrentStartDate] = useState<Date | undefined>(new Date())
  const [currentEndDate, setCurrentEndDate] = useState<Date | undefined>()
  const [currentPersonnel, setCurrentPersonnel] = useState("") // Comma-separated string for simplicity

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
      startDate: currentStartDate || new Date(),
      endDate: currentEndDate || new Date(), // Ensure endDate is a Date
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
        progress: 0, // Initial progress for new plan
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setAuditPlans((prevPlans) => [...prevPlans, newPlan])
    }
    setIsFormOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-foreground">Manage Audit Plans</h1>
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
      </div>

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
            {/* Add Filter button here if needed in future */}
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

                    let progressColor = "bg-blue-500" // Default for In Progress
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
                          <div className="text-xs text-muted-foreground truncate w-60" title={plan.objectives}>
                            {plan.objectives}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={badgeVariant}
                            className={plan.status === "Completed" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
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
                              <div
                                key={i}
                                className="inline-block h-7 w-7 rounded-full ring-2 ring-background bg-muted-foreground text-muted text-xs flex items-center justify-center"
                                title={p}
                              >
                                {p.substring(0, 1).toUpperCase()}
                              </div>
                            ))}
                            {plan.personnel.length > 3 && (
                              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-background bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                +{plan.personnel.length - 3}
                              </div>
                            )}
                          </div>
                          {plan.personnel.length === 0 && <span className="text-xs text-muted-foreground">N/A</span>}
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
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePlan(plan.id)}>
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
    </div>
  )
}
