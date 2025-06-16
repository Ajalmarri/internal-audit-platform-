"use client"

import type React from "react"
import type { BadgeProps } from "@/components/ui/badge"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  SlidersHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react"

// Types for Action Plans
interface ActionPlanItem {
  id: string
  action: string
  responsiblePerson: string
  dueDate: string // ISO Date string
  status: "To Do" | "In Progress" | "Completed" | "Blocked"
}

interface ActionPlan {
  id: string
  findingId: string
  findingTitle: string
  businessOwner: string
  overallObjective: string
  items: ActionPlanItem[]
  submittedDate: string
  lastUpdated: string
  progress: number // 0-100
  status: "Not Started" | "In Progress" | "Completed" | "Overdue" | "At Risk"
}

// Mock data for Action Plans
const mockActionPlans: ActionPlan[] = [
  {
    id: "AP001",
    findingId: "FND001",
    findingTitle: "Unsecured S3 Bucket Exposing Sensitive Data",
    businessOwner: "IT Security Manager",
    overallObjective: "Secure all S3 buckets and implement proper access controls",
    items: [
      {
        id: "AP001-1",
        action: "Restrict public access to the S3 bucket",
        responsiblePerson: "Cloud Security Team",
        dueDate: "2025-06-15",
        status: "Completed",
      },
      {
        id: "AP001-2",
        action: "Review and update S3 bucket ACLs and policies",
        responsiblePerson: "Cloud Security Team",
        dueDate: "2025-06-20",
        status: "In Progress",
      },
      {
        id: "AP001-3",
        action: "Implement automated checks for S3 bucket configurations",
        responsiblePerson: "DevOps Team",
        dueDate: "2025-07-01",
        status: "To Do",
      },
    ],
    submittedDate: "2025-06-05",
    lastUpdated: "2025-06-10",
    progress: 40,
    status: "In Progress",
  },
  {
    id: "AP002",
    findingId: "FND002",
    findingTitle: "Lack of Segregation of Duties in Financial Reporting",
    businessOwner: "Finance Department Head",
    overallObjective: "Implement proper segregation of duties for financial reporting",
    items: [
      {
        id: "AP002-1",
        action: "Review all financial system roles and permissions",
        responsiblePerson: "Finance Systems Admin",
        dueDate: "2025-07-15",
        status: "To Do",
      },
      {
        id: "AP002-2",
        action: "Redefine roles to ensure SoD",
        responsiblePerson: "Finance Controller",
        dueDate: "2025-08-15",
        status: "To Do",
      },
      {
        id: "AP002-3",
        action: "Update SOPs and train relevant staff",
        responsiblePerson: "Finance Training Lead",
        dueDate: "2025-09-15",
        status: "To Do",
      },
    ],
    submittedDate: "2025-06-04",
    lastUpdated: "2025-06-04",
    progress: 0,
    status: "Not Started",
  },
  {
    id: "AP003",
    findingId: "FND003",
    findingTitle: "Outdated Anti-Virus Signatures on Critical Servers",
    businessOwner: "IT Operations Lead",
    overallObjective: "Ensure all critical servers have up-to-date AV signatures and robust monitoring",
    items: [
      {
        id: "AP003-1",
        action: "Manually update AV on SRV01, SRV05, DB02",
        responsiblePerson: "SysAdmin Team",
        dueDate: "2025-06-10",
        status: "Completed",
      },
      {
        id: "AP003-2",
        action: "Investigate and fix automated AV update script",
        responsiblePerson: "DevOps Team",
        dueDate: "2025-06-15",
        status: "Completed",
      },
      {
        id: "AP003-3",
        action: "Implement enhanced monitoring for AV update failures",
        responsiblePerson: "Monitoring Team",
        dueDate: "2025-06-20",
        status: "Completed",
      },
    ],
    submittedDate: "2025-06-02",
    lastUpdated: "2025-06-18",
    progress: 100,
    status: "Completed",
  },
  {
    id: "AP004",
    findingId: "FND004",
    findingTitle: "Inadequate Password Policy for Admin Accounts",
    businessOwner: "IT Security Manager",
    overallObjective: "Strengthen password policies for all administrative accounts",
    items: [
      {
        id: "AP004-1",
        action: "Update password policy in Active Directory",
        responsiblePerson: "Identity Management Team",
        dueDate: "2025-05-20",
        status: "Blocked",
      },
      {
        id: "AP004-2",
        action: "Implement MFA for all admin accounts",
        responsiblePerson: "Security Operations",
        dueDate: "2025-05-25",
        status: "In Progress",
      },
    ],
    submittedDate: "2025-05-10",
    lastUpdated: "2025-06-01",
    progress: 30,
    status: "At Risk",
  },
  {
    id: "AP005",
    findingId: "FND005",
    findingTitle: "Missing Backup Verification Procedures",
    businessOwner: "Data Management Lead",
    overallObjective: "Establish and implement backup verification procedures",
    items: [
      {
        id: "AP005-1",
        action: "Document backup verification procedures",
        responsiblePerson: "Backup Team Lead",
        dueDate: "2025-04-15",
        status: "Completed",
      },
      {
        id: "AP005-2",
        action: "Implement automated backup testing",
        responsiblePerson: "DevOps Team",
        dueDate: "2025-04-30",
        status: "In Progress",
      },
      {
        id: "AP005-3",
        action: "Schedule regular backup restoration drills",
        responsiblePerson: "Disaster Recovery Team",
        dueDate: "2025-05-10",
        status: "To Do",
      },
    ],
    submittedDate: "2025-04-01",
    lastUpdated: "2025-05-05",
    progress: 45,
    status: "Overdue",
  },
]

// Configuration for Action Plan Status display
const actionPlanStatusConfig: Record<ActionPlan["status"], { icon: React.ElementType; color: string }> = {
  "Not Started": { icon: Clock, color: "text-gray-500" },
  "In Progress": { icon: Clock, color: "text-blue-500" },
  Completed: { icon: CheckCircle, color: "text-green-500" },
  Overdue: { icon: AlertTriangle, color: "text-red-500" },
  "At Risk": { icon: XCircle, color: "text-orange-500" },
}

export default function ActionPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(mockActionPlans)

  // Filter states
  const [statusFilters, setStatusFilters] = useState<Record<ActionPlan["status"], boolean>>({
    "Not Started": false,
    "In Progress": false,
    Completed: false,
    Overdue: false,
    "At Risk": false,
  })

  const filteredActionPlans = useMemo(() => {
    let currentPlans = [...actionPlans]

    // Apply search term
    if (searchTerm) {
      currentPlans = currentPlans.filter(
        (plan) =>
          plan.findingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.businessOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.overallObjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.findingId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filters
    const activeStatusFilters = Object.entries(statusFilters)
      .filter(([_, isActive]) => isActive)
      .map(([status]) => status)

    if (activeStatusFilters.length > 0) {
      currentPlans = currentPlans.filter((plan) => activeStatusFilters.includes(plan.status))
    }

    return currentPlans
  }, [actionPlans, searchTerm, statusFilters])

  const handleDeleteActionPlan = (planId: string) => {
    // Placeholder for actual delete logic (e.g., API call)
    setActionPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId))
    console.log("Delete action plan:", planId)
  }

  const getProgressColor = (status: ActionPlan["status"], progress: number) => {
    if (status === "Completed") return "bg-green-500"
    if (status === "Overdue") return "bg-red-500"
    if (status === "At Risk") return "bg-orange-500"
    if (progress > 60) return "bg-blue-500"
    return "bg-blue-400"
  }

  const getActionPlanStatusBadgeVariant = (status: ActionPlan["status"]): BadgeProps["variant"] => {
    switch (status) {
      case "Completed":
        return "success" // Assuming 'success' variant is green or defined in badge.tsx
      case "In Progress":
        return "inProgress"
      case "Overdue":
        return "destructive"
      case "At Risk":
        // Assuming 'warning' variant is orange/yellow or defined in badge.tsx
        // If not, you might use 'destructive' or a custom class still.
        // For now, let's use 'outline' and rely on icon color, or create a 'warning' variant.
        // Let's assume a 'warning' variant exists or will be added for consistency.
        return "warning"
      case "Not Started":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-foreground">Action Plans</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/action-plans/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Action Plan
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action Plans List</CardTitle>
          <CardDescription>Track and manage action plans for addressing audit findings.</CardDescription>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by finding, business owner, objective..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(statusFilters).map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilters[status as ActionPlan["status"]]}
                    onCheckedChange={(checked) => setStatusFilters((prev) => ({ ...prev, [status]: !!checked }))}
                  >
                    <span className="flex items-center">
                      {status === "Not Started" && <Clock className="mr-2 h-4 w-4 text-gray-500" />}
                      {status === "In Progress" && <Clock className="mr-2 h-4 w-4 text-blue-500" />}
                      {status === "Completed" && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                      {status === "Overdue" && <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />}
                      {status === "At Risk" && <XCircle className="mr-2 h-4 w-4 text-orange-500" />}
                      {status}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[250px]">Finding</TableHead>
                  <TableHead>Business Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Progress</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActionPlans.length > 0 ? (
                  filteredActionPlans.map((plan) => {
                    const statusInfo = actionPlanStatusConfig[plan.status]
                    return (
                      <TableRow key={plan.id}>
                        <TableCell className="font-mono text-xs">{plan.id}</TableCell>
                        <TableCell>
                          <div
                            className="font-medium truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                            title={plan.findingTitle}
                          >
                            {plan.findingTitle}
                          </div>
                          <div className="text-xs text-muted-foreground">Finding ID: {plan.findingId}</div>
                        </TableCell>
                        <TableCell className="truncate max-w-[150px]" title={plan.businessOwner}>
                          {plan.businessOwner}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getActionPlanStatusBadgeVariant(plan.status)}>
                            <statusInfo.icon className={`mr-1.5 h-3.5 w-3.5 ${statusInfo.color}`} />
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={plan.progress}
                              className="h-2 flex-grow"
                              indicatorClassName={getProgressColor(plan.status, plan.progress)}
                            />
                            <span className="text-xs text-muted-foreground">{plan.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(plan.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-5 w-5" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/action-plans/${plan.id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/action-plans/${plan.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit Plan
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteActionPlan(plan.id)}
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      No action plans match your criteria.
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
