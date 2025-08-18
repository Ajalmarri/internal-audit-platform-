"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
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
  Loader2,
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

type AuditPlanStatus = "Draft" | "Active" | "In Progress" | "Completed" | "Cancelled"

// Updated AuditPlan interface to match database schema
interface AuditPlan {
  id: string
  title: string
  year: string
  status?: AuditPlanStatus
  progress?: number
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
  is_deleted: number
}

// Assignment interface to link to plans
export interface LinkedAssignment {
  id: string
  name: string
  auditPlanId: string
  status: "Not Started" | "In Progress" | "Completed" | "Overdue" | "Blocked"
}

const currentYear = new Date().getFullYear()

// Will fetch real assignments for each plan
export const mockAssignments: LinkedAssignment[] = []

const statusConfig: Record<
  AuditPlanStatus,
  { icon: React.ElementType; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }
> = {
  Draft: { icon: FileText, color: "text-gray-500", badgeVariant: "outline" },
  Active: { icon: Rocket, color: "text-sky-600", badgeVariant: "default" },
  "In Progress": { icon: Rocket, color: "text-sky-600", badgeVariant: "default" },
  Completed: { icon: CheckCircle2, color: "text-green-600", badgeVariant: "default" },
  Cancelled: { icon: XCircleIcon, color: "text-red-600", badgeVariant: "destructive" },
}

export default function AuditPlansPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [auditPlans, setAuditPlans] = useState<AuditPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [assignmentsByPlan, setAssignmentsByPlan] = useState<Record<string, LinkedAssignment[]>>({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<AuditPlan | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))

  // Form state
  const [currentTitle, setCurrentTitle] = useState("")
  const [currentDescription, setCurrentDescription] = useState("")
  const [currentStatus, setCurrentStatus] = useState<AuditPlanStatus>("Draft")

  // Fetch audit plans and assignments from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [plansRes, assignmentsRes] = await Promise.all([
          fetch('/api/audit-plans'),
          fetch('/api/assignments'),
        ])
        if (!plansRes.ok) throw new Error('Failed to fetch audit plans')
        if (!assignmentsRes.ok) throw new Error('Failed to fetch assignments')

        const [plans, assignments] = await Promise.all([plansRes.json(), assignmentsRes.json()])
        setAuditPlans(plans)
        const grouped: Record<string, LinkedAssignment[]> = {}
        ;(assignments as any[]).forEach((a) => {
          const planId = a.audit_plan_id
          if (!planId) return
          if (!grouped[planId]) grouped[planId] = []
          grouped[planId].push({
            id: a.id,
            name: a.title,
            auditPlanId: planId,
            status: (a.status as LinkedAssignment['status']) || 'Not Started',
          })
        })
        setAssignmentsByPlan(grouped)
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load data from database.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const filteredAuditPlans = useMemo(() => {
    return auditPlans.filter((plan) => 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, auditPlans])

  const resetFormStates = () => {
    setCurrentTitle("")
    setCurrentDescription("")
    setCurrentStatus("Draft")
  }

  const openAddPlanForm = () => {
    setEditingPlan(null)
    resetFormStates()
    setIsFormOpen(true)
  }

  const openEditPlanForm = (plan: AuditPlan) => {
    setEditingPlan(plan)
    setCurrentTitle(plan.title)
    setCurrentDescription(plan.year || "")
    setCurrentStatus(plan.status || "Draft")
    setIsFormOpen(true)
  }

  const handleDeletePlan = (planId: string) => {
    setAuditPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId))
    toast({ title: "Success", description: "Audit plan deleted." })
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const planData: Partial<AuditPlan> = {
      title: currentTitle,
      year: currentDescription,
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
        title: currentTitle,
        year: currentDescription || "2024",
        is_deleted: 0,
      }
      setAuditPlans((prevPlans) => [...prevPlans, newPlan])
      toast({ title: "Success", description: "New audit plan created." })
    }
    setIsFormOpen(false)
  }

  const availableYears = useMemo(() => {
    const years = new Set<number>()
    
    // Safely parse years from audit plans, filtering out invalid values
    auditPlans.forEach((p) => {
      const parsedYear = parseInt(p.year)
      if (!isNaN(parsedYear)) {
        years.add(parsedYear)
      }
    })
    
    // Add a few future years for creating new plans
    for (let i = 0; i <= 2; i++) {
      years.add(currentYear + i)
    }
    
    return Array.from(years).sort((a: number, b: number) => b - a)
  }, [auditPlans])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Manage Audit Plans</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading audit plans...</span>
          </div>
        </div>
      </div>
    )
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
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    className="col-span-3"
                    placeholder={`e.g., Internal Audit Plan ${currentYear}`}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={currentDescription}
                    onChange={(e) => setCurrentDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="Brief description of the audit plan..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Year
                  </Label>
                  <Select
                    value={String(currentYear)}
                    onValueChange={(value) => setSelectedYear(value)}
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
                    const config = statusConfig[plan.status || "Draft"]
                    const StatusIcon = config.icon
                    const statusColor = config.color
                    const badgeVariant = config.badgeVariant

                    let progressColor = "bg-sky-500"
                    if (plan.status === "Completed") progressColor = "bg-green-500"
                    else if (plan.status === "Draft") progressColor = "bg-gray-400"
                    else if (plan.status === "Cancelled") progressColor = "bg-red-500"
                    else if (plan.status === "In Progress") progressColor = "bg-sky-500"

                    const linkedAssignments = assignmentsByPlan[plan.id] || []

                    return (
                      <TableRow key={plan.id} className={plan.is_deleted ? "opacity-50 bg-gray-50" : ""}>
                        <TableCell>
                          <div className="font-medium">{plan.title}</div>
                          <div className="text-xs text-muted-foreground">{plan.year}</div>
                          {plan.is_deleted && <div className="text-xs text-red-500">(Deleted)</div>}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={badgeVariant}
                            className={
                              plan.status === "Completed"
                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                                : plan.status === "Active" || plan.status === "In Progress"
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
                              value={plan.progress || 0}
                              className="h-2 flex-grow"
                              indicatorClassName={progressColor}
                            />
                            <span className="text-xs text-muted-foreground">{plan.progress || 0}%</span>
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
                                    description: `Viewing details for ${plan.title}`,
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
