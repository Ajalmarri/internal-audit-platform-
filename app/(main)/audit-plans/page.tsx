"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Link from "next/link"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

type AuditPlanStatus = "Draft" | "In Progress" | "Completed" | "Cancelled"

// Simplified AuditPlan interface
interface AuditPlan {
  id: string
  name: string
  year: number
  status: AuditPlanStatus
  progress: number
}

// Assignment interface to link to plans
export interface LinkedAssignment {
  id: string
  name: string
  auditPlanId: string
  status: "Not Started" | "In Progress" | "Completed" | "Overdue" | "Blocked"
}

const currentYear = new Date().getFullYear()

// Mock Data Refactored
const initialMockAuditPlans: AuditPlan[] = [
  {
    id: "AP2025",
    name: `Internal Audit Plan ${currentYear}`,
    year: currentYear,
    status: "In Progress",
    progress: 65,
  },
  {
    id: "AP2024",
    name: `Internal Audit Plan ${currentYear - 1}`,
    year: currentYear - 1,
    status: "Completed",
    progress: 100,
  },
  {
    id: "AP2023",
    name: `Internal Audit Plan ${currentYear - 2}`,
    year: currentYear - 2,
    status: "Completed",
    progress: 100,
  },
  {
    id: "AP2026_DRAFT",
    name: `Internal Audit Plan ${currentYear + 1}`,
    year: currentYear + 1,
    status: "Draft",
    progress: 10,
  },
]

export const mockAssignments: LinkedAssignment[] = [
  { id: "ASGN001", name: "Q1 Financial Controls", auditPlanId: "AP2025", status: "Completed" },
  { id: "ASGN002", name: "IT General Controls Review", auditPlanId: "AP2025", status: "In Progress" },
  { id: "ASGN003", name: "Vendor Risk Assessment", auditPlanId: "AP2025", status: "In Progress" },
  { id: "ASGN004", name: "Q3 Compliance Check", auditPlanId: "AP2025", status: "Not Started" },
  { id: "ASGN005", name: "Annual Financial Statement Audit", auditPlanId: "AP2024", status: "Completed" },
  { id: "ASGN006", name: "Cybersecurity Audit", auditPlanId: "AP2024", status: "Completed" },
  { id: "ASGN007", name: "Operational Efficiency Audit", auditPlanId: "AP2023", status: "Completed" },
]

const statusConfig: Record<
  AuditPlanStatus,
  { icon: React.ElementType; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" | "info" }
> = {
  Draft: { icon: FileText, color: "text-gray-500", badgeVariant: "outline" },
  "In Progress": { icon: Rocket, color: "text-sky-600", badgeVariant: "info" },
  Completed: { icon: CheckCircle2, color: "text-green-600", badgeVariant: "default" },
  Cancelled: { icon: XCircleIcon, color: "text-red-600", badgeVariant: "destructive" },
}

export default function AuditPlansPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [auditPlans, setAuditPlans] = useState<AuditPlan[]>(initialMockAuditPlans)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<AuditPlan | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))

  // Form state
  const [currentName, setCurrentName] = useState("")
  const [currentYearValue, setCurrentYearValue] = useState<number>(currentYear)
  const [currentStatus, setCurrentStatus] = useState<AuditPlanStatus>("Draft")

  const filteredAuditPlans = useMemo(() => {
    return auditPlans
      .filter((plan) => plan.year === Number.parseInt(selectedYear, 10))
      .filter((plan) => plan.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm, auditPlans, selectedYear])

  const resetFormStates = () => {
    setCurrentName("")
    setCurrentYearValue(currentYear)
    setCurrentStatus("Draft")
  }

  const openAddPlanForm = () => {
    setEditingPlan(null)
    resetFormStates()
    setIsFormOpen(true)
  }

  const openEditPlanForm = (plan: AuditPlan) => {
    setEditingPlan(plan)
    setCurrentName(plan.name)
    setCurrentYearValue(plan.year)
    setCurrentStatus(plan.status)
    setIsFormOpen(true)
  }

  const handleDeletePlan = (planId: string) => {
    setAuditPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId))
    toast({ title: "Success", description: "Audit plan deleted." })
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const planData: Omit<AuditPlan, "id" | "progress"> = {
      name: currentName,
      year: currentYearValue,
      status: currentStatus,
    }

    if (editingPlan) {
      setAuditPlans((prevPlans) =>
        prevPlans.map((p) => (p.id === editingPlan.id ? { ...editingPlan, ...planData } : p)),
      )
      toast({ title: "Success", description: "Audit plan updated." })
    } else {
      const newPlan: AuditPlan = {
        ...planData,
        id: `AP${String(auditPlans.length + 1).padStart(3, "0")}`,
        progress: 0,
      }
      setAuditPlans((prevPlans) => [...prevPlans, newPlan])
      toast({ title: "Success", description: "New audit plan created." })
    }
    setIsFormOpen(false)
  }

  const availableYears = useMemo(() => {
    const years = new Set(auditPlans.map((p) => p.year))
    // Add a few future years for creating new plans
    for (let i = 0; i <= 2; i++) {
      years.add(currentYear + i)
    }
    return Array.from(years).sort((a, b) => b - a)
  }, [auditPlans])

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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Audit Plan" : "Create New Audit Plan"}</DialogTitle>
              <DialogDescription>
                {editingPlan
                  ? "Update the details of the existing audit plan."
                  : "Define a new audit plan for a specific year."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Plan Name
                  </Label>
                  <Input
                    id="name"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    className="col-span-3"
                    placeholder={`e.g., Internal Audit Plan ${currentYearValue}`}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Year
                  </Label>
                  <Select
                    value={String(currentYearValue)}
                    onValueChange={(value) => setCurrentYearValue(Number.parseInt(value, 10))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={currentStatus} onValueChange={(value) => setCurrentStatus(value as AuditPlanStatus)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(statusConfig).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
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
          <CardDescription>A list of all audits, filterable by year.</CardDescription>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search plans by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Plan Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Progress</TableHead>
                  <TableHead>Linked Assignments</TableHead>
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
                    else if (plan.status === "Draft") progressColor = "bg-gray-400"
                    else if (plan.status === "Cancelled") progressColor = "bg-red-500"

                    const linkedAssignments = mockAssignments.filter((a) => a.auditPlanId === plan.id)

                    return (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-xs text-muted-foreground">{plan.year}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={badgeVariant}
                            className={
                              plan.status === "Completed"
                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                                : plan.status === "In Progress"
                                  ? "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200"
                                  : ""
                            }
                          >
                            <StatusIcon className={`mr-1.5 h-3.5 w-3.5 ${statusColor}`} />
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={plan.progress}
                              className={`h-2 flex-grow ${progressColor}`}
                            />
                            <span className="text-xs text-muted-foreground">{plan.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {linkedAssignments.length > 0 ? (
                              linkedAssignments.map((assignment) => (
                                <Link key={assignment.id} href={`/assignments/${assignment.id}`} passHref>
                                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">
                                    {assignment.name}
                                  </Badge>
                                </Link>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No assignments linked</span>
                            )}
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
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "View Details",
                                    description: `Viewing details for ${plan.name}`,
                                  })
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditPlanForm(plan)}>
                                <Edit3 className="mr-2 h-4 w-4" /> Edit Plan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      No audit plans found for {selectedYear}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
