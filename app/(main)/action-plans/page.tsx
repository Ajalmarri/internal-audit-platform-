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
  ThumbsUp,
  MessageSquareWarning,
  Send,
} from "lucide-react"

import type { ActionPlan, ActionPlanStatus } from "./_types/action-plan-types"
import RequestChangesModal from "./_components/request-changes-modal"

// Mock data for Action Plans - Updated with new fields and statuses
const mockActionPlans: ActionPlan[] = [
  {
    id: "AP001",
    findingId: "FND001",
    findingTitle: "Unsecured S3 Bucket Exposing Sensitive Data",
    businessOwner: "IT Security Manager",
    auditorInCharge: "Alice Wonderland",
    overallObjective: "Secure all S3 buckets and implement proper access controls",
    items: [
      {
        id: "AP001-1",
        action: "Restrict public access",
        responsiblePerson: "Cloud Team",
        dueDate: "2025-06-15",
        status: "Completed",
      },
      {
        id: "AP001-2",
        action: "Review policies",
        responsiblePerson: "Cloud Team",
        dueDate: "2025-06-20",
        status: "In Progress",
      },
    ],
    submittedDate: "2025-06-05",
    lastUpdated: "2025-06-10",
    progress: 50,
    status: "In Progress",
  },
  {
    id: "AP002",
    findingId: "FND002",
    findingTitle: "Lack of Segregation of Duties",
    businessOwner: "Finance Head",
    auditorInCharge: "Bob The Builder",
    overallObjective: "Implement proper SoD for financial reporting",
    items: [
      {
        id: "AP002-1",
        action: "Review roles",
        responsiblePerson: "Finance Admin",
        dueDate: "2025-07-15",
        status: "To Do",
      },
    ],
    submittedDate: "2025-06-10",
    lastUpdated: "2025-06-10",
    progress: 0,
    status: "Submitted for Review",
    reviewFeedback:
      "The initial plan looks good, but please add specific sub-tasks for training staff on the new SoD policies.",
  },
  {
    id: "AP003",
    findingId: "FND003",
    findingTitle: "Outdated Anti-Virus",
    businessOwner: "IT Operations Lead",
    auditorInCharge: "Alice Wonderland",
    overallObjective: "Ensure all servers have up-to-date AV",
    items: [
      {
        id: "AP003-1",
        action: "Update AV",
        responsiblePerson: "SysAdmin Team",
        dueDate: "2025-06-10",
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
    findingTitle: "Inadequate Password Policy",
    businessOwner: "IT Security Manager",
    auditorInCharge: "Charlie Brown",
    overallObjective: "Strengthen password policies",
    items: [
      {
        id: "AP004-1",
        action: "Update policy",
        responsiblePerson: "IDM Team",
        dueDate: "2025-05-20",
        status: "Blocked",
      },
    ],
    submittedDate: "2025-06-12",
    lastUpdated: "2025-06-12",
    progress: 0,
    status: "Submitted for Review",
  },
  {
    id: "AP005",
    findingId: "FND005",
    findingTitle: "Missing Backup Verification",
    businessOwner: "Data Management Lead",
    auditorInCharge: "Bob The Builder",
    overallObjective: "Establish backup verification",
    items: [
      {
        id: "AP005-1",
        action: "Document procedures",
        responsiblePerson: "Backup Lead",
        dueDate: "2025-04-15",
        status: "Completed",
      },
    ],
    submittedDate: "2025-05-01",
    lastUpdated: "2025-06-15",
    progress: 30,
    status: "Changes Requested",
    reviewFeedback:
      "The documented procedures are not detailed enough. Please include step-by-step instructions for verification and expected outcomes.",
  },
]

// Configuration for Action Plan Status display - Updated
const actionPlanStatusConfig: Record<
  ActionPlanStatus,
  { icon: React.ElementType; color: string; badgeVariant?: "default" | "secondary" | "destructive" | "outline" }
> = {
  "Not Started": { icon: Clock, color: "text-gray-500", badgeVariant: "secondary" },
  "In Progress": { icon: Clock, color: "text-blue-500", badgeVariant: "secondary" },
  Completed: { icon: CheckCircle, color: "text-green-500", badgeVariant: "default" }, // 'default' often green in shadcn
  Overdue: { icon: AlertTriangle, color: "text-red-500", badgeVariant: "destructive" },
  "At Risk": { icon: XCircle, color: "text-orange-500", badgeVariant: "secondary" }, // Or a custom orange
  "Submitted for Review": { icon: Send, color: "text-purple-500", badgeVariant: "secondary" },
  "Changes Requested": { icon: MessageSquareWarning, color: "text-yellow-600", badgeVariant: "secondary" }, // Or a custom yellow
}

export default function ActionPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(mockActionPlans)
  const [statusFilters, setStatusFilters] = useState<Record<ActionPlanStatus, boolean>>({
    "Not Started": false,
    "In Progress": false,
    Completed: false,
    Overdue: false,
    "At Risk": false,
    "Submitted for Review": false,
    "Changes Requested": false,
  })

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [selectedPlanForReview, setSelectedPlanForReview] = useState<ActionPlan | null>(null)

  const filteredActionPlans = useMemo(() => {
    let currentPlans = [...actionPlans]
    if (searchTerm) {
      currentPlans = currentPlans.filter(
        (plan) =>
          plan.findingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.businessOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (plan.auditorInCharge && plan.auditorInCharge.toLowerCase().includes(searchTerm.toLowerCase())) ||
          plan.overallObjective.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.findingId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    const activeStatusFilters = Object.entries(statusFilters)
      .filter(([_, isActive]) => isActive)
      .map(([status]) => status)
    if (activeStatusFilters.length > 0) {
      currentPlans = currentPlans.filter((plan) => activeStatusFilters.includes(plan.status))
    }
    return currentPlans
  }, [actionPlans, searchTerm, statusFilters])

  const handleDeleteActionPlan = (planId: string) => {
    setActionPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId))
  }

  const handleApproveActionPlan = (planId: string) => {
    setActionPlans((prevPlans) =>
      prevPlans.map((p) =>
        p.id === planId ? { ...p, status: "In Progress", lastUpdated: new Date().toISOString().split("T")[0] } : p,
      ),
    )
  }

  const handleOpenRequestChangesModal = (plan: ActionPlan) => {
    setSelectedPlanForReview(plan)
    setIsRequestModalOpen(true)
  }

  const handleSubmitFeedback = (planId: string, feedback: string) => {
    setActionPlans((prevPlans) =>
      prevPlans.map((p) =>
        p.id === planId
          ? {
              ...p,
              status: "Changes Requested",
              reviewFeedback: feedback,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : p,
      ),
    )
    setIsRequestModalOpen(false)
    setSelectedPlanForReview(null)
  }

  const getProgressColor = (status: ActionPlanStatus, progress: number) => {
    if (status === "Completed") return "bg-green-500"
    if (status === "Overdue") return "bg-red-500"
    if (status === "At Risk") return "bg-orange-500"
    if (status === "Changes Requested") return "bg-yellow-500"
    if (progress > 60) return "bg-blue-500"
    return "bg-blue-400"
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
                placeholder="Search by finding, owner, auditor..."
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
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(statusFilters).map((statusKey) => {
                  const status = statusKey as ActionPlanStatus
                  const config = actionPlanStatusConfig[status]
                  return (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilters[status]}
                      onCheckedChange={(checked) => setStatusFilters((prev) => ({ ...prev, [status]: !!checked }))}
                    >
                      <span className="flex items-center">
                        {config && <config.icon className={`mr-2 h-4 w-4 ${config.color}`} />}
                        {status}
                      </span>
                    </DropdownMenuCheckboxItem>
                  )
                })}
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
                  <TableHead className="min-w-[150px]">Auditor-in-Charge</TableHead> {/* New Column */}
                  <TableHead className="min-w-[200px]">Status</TableHead> {/* Increased width for buttons */}
                  <TableHead className="w-[150px]">Progress</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right sticky right-0 bg-card z-10">Actions</TableHead>
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
                        <TableCell className="truncate max-w-[150px]" title={plan.auditorInCharge}>
                          {" "}
                          {/* New Cell */}
                          {plan.auditorInCharge || "N/A"}
                        </TableCell>
                        <TableCell>
                          {plan.status === "Submitted for Review" ? (
                            <div className="flex gap-2 items-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-500 hover:bg-green-600 text-white border-green-600 hover:border-green-700 h-8 px-2 py-1 text-xs"
                                onClick={() => handleApproveActionPlan(plan.id)}
                              >
                                <ThumbsUp className="mr-1.5 h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 py-1 text-xs"
                                onClick={() => handleOpenRequestChangesModal(plan)}
                              >
                                <MessageSquareWarning className="mr-1.5 h-3.5 w-3.5" /> Request Changes
                              </Button>
                            </div>
                          ) : (
                            <Badge
                              variant={statusInfo.badgeVariant || "secondary"}
                              className={
                                plan.status === "Completed"
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : plan.status === "Overdue"
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : plan.status === "At Risk"
                                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                                      : plan.status === "Changes Requested"
                                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                                        : "" // Let badgeVariant and default styles handle others
                              }
                            >
                              {statusInfo && <statusInfo.icon className={`mr-1.5 h-3.5 w-3.5 ${statusInfo.color}`} />}
                              {plan.status}
                            </Badge>
                          )}
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
                        <TableCell className="text-right sticky right-0 bg-card z-10">
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
                    <TableCell colSpan={8} className="h-24 text-center">
                      {" "}
                      {/* Updated colSpan */}
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

      {selectedPlanForReview && (
        <RequestChangesModal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false)
            setSelectedPlanForReview(null)
          }}
          onSubmitFeedback={handleSubmitFeedback}
          actionPlan={selectedPlanForReview}
        />
      )}
    </div>
  )
}
