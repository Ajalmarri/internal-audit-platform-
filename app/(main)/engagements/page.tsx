"use client"

import * as React from "react"
import { useRouter } from "next/navigation" // Import useRouter
import {
  ChevronDown,
  MoreHorizontal,
  PlusCircle,
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Eye,
  LayoutDashboard,
  Edit3,
  FileText,
  Archive,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type EngagementStatus = "Planning" | "In Progress" | "On Hold" | "Completed"

type EngagementKpi = {
  openFindings?: number
  overdueActions?: number
}

type Assignment = {
  id: string
  name: string
}

type Engagement = {
  id: string
  title: string
  stakeholder: string
  manager: string
  startDate: string
  endDate: string
  status: string
  objective?: string
  scope?: string
  assignments?: string
  assignmentCount?: number
  assignmentList?: Assignment[]
  created_at: string
  updated_at: string
}

// Real data will be fetched from API
const mockEngagements: Engagement[] = []

const getStatusBadgeVariant = (status: string): BadgeProps["variant"] => {
  switch (status) {
    case "In Progress":
      return "default"
    case "Planning":
      return "secondary"
    case "On Hold":
      return "outline"
    case "Completed":
      return "success"
    case "Active":
      return "default"
    case "Cancelled":
      return "destructive"
    default:
      return "default"
  }
}

interface KpiIndicatorProps {
  count?: number
  iconType: "warning" | "critical" | "success" | "neutral"
  tooltipContent: string
  isClickable?: boolean
  onClick?: () => void
}

const KpiIndicator: React.FC<KpiIndicatorProps> = ({
  count,
  iconType,
  tooltipContent,
  isClickable = true,
  onClick,
}) => {
  const displayIconType = count === 0 && (iconType === "warning" || iconType === "critical") ? "success" : iconType

  const IconComponent =
    displayIconType === "warning"
      ? AlertTriangle
      : displayIconType === "critical"
        ? XCircle
        : displayIconType === "success"
          ? CheckCircle
          : Eye

  const iconColor =
    displayIconType === "warning"
      ? "text-yellow-500"
      : displayIconType === "critical"
        ? "text-red-500"
        : displayIconType === "success"
          ? "text-green-500"
          : "text-muted-foreground"

  if (typeof count === "undefined" && iconType !== "success" && iconType !== "neutral") {
    return null
  }

  const content = (
    <div className="flex items-center space-x-1 text-xs">
      <IconComponent className={cn("h-4 w-4", iconColor)} />
      {typeof count !== "undefined" && <span className="font-medium">{count}</span>}
    </div>
  )

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {isClickable ? (
            <Button variant="ghost" size="sm" className="h-auto p-1" onClick={onClick} aria-label={tooltipContent}>
              {content}
            </Button>
          ) : (
            <div className="p-1">{content}</div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function EngagementsPage() {
  const router = useRouter() // Initialize router
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("All")
  const [managerFilter, setManagerFilter] = React.useState<string>("All")
  const [engagements, setEngagements] = React.useState<Engagement[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch real data from API
  React.useEffect(() => {
    const fetchEngagements = async () => {
      try {
        console.log('Fetching engagements from API...')
        setIsLoading(true)
        const response = await fetch('/api/engagements')
        if (!response.ok) throw new Error('Failed to fetch engagements')
        const data = await response.json()
        console.log('Engagements data received:', data)
        console.log('Setting engagements state with:', data.length, 'items')
        setEngagements(data)
      } catch (error) {
        console.error('Error loading engagements:', error)
        // Fallback to empty array if API fails
        setEngagements([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEngagements()
  }, [])

  // Debug: Monitor engagements state changes
  React.useEffect(() => {
    console.log('Engagements state changed:', engagements.length, 'items')
  }, [engagements])

  const engagementManagers = React.useMemo(() => {
    const managers = new Set(engagements.map((e) => e.manager))
    return ["All", ...Array.from(managers)]
  }, [engagements])

  const filteredEngagements = React.useMemo(() => {
    console.log('Filtering engagements. Total:', engagements.length, 'Search:', searchTerm, 'Status:', statusFilter, 'Manager:', managerFilter)
    
    if (engagements.length === 0) {
      console.log('No engagements to filter')
      return []
    }
    
    const filtered = engagements.filter((engagement) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      const matchesSearch =
        engagement.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        engagement.stakeholder.toLowerCase().includes(lowerCaseSearchTerm) ||
        engagement.manager.toLowerCase().includes(lowerCaseSearchTerm)

      const matchesStatus = statusFilter === "All" || engagement.status === statusFilter

      const matchesManager = managerFilter === "All" || engagement.manager === managerFilter

      const result = matchesSearch && matchesStatus && matchesManager
      
      if (!result) {
        console.log('Engagement filtered out:', engagement.title, 'Search:', matchesSearch, 'Status:', matchesStatus, 'Manager:', matchesManager)
      }
      
      return result
    })
    
    console.log('Filtered result:', filtered.length, 'items')
    return filtered
  }, [engagements, searchTerm, statusFilter, managerFilter])

  const handleViewDashboard = (engagementId: string) => {
    router.push(`/engagements/${engagementId}/dashboard`)
  }
  const handleEditEngagement = (engagementId: string) => {
    router.push(`/engagements/${engagementId}/edit`)
  }
  const handleGenerateReport = (engagementId: string) => {
    console.log(`Generate Report for engagement: ${engagementId}`)
    // Implement report generation logic (e.g., API call, download)
    alert(`Report generation initiated for ${engagementId}. This might take a moment.`)
  }
  const handleArchiveEngagement = (engagementId: string) => {
    if (confirm(`Are you sure you want to archive engagement: ${engagementId}?`)) {
      console.log(`Archive Engagement: ${engagementId}`)
      // Implement archive logic (e.g., API call to update status)
      alert(`Engagement ${engagementId} has been archived.`)
      // Optionally, refresh data or remove from list:
      // setData(prevData => prevData.filter(eng => eng.id !== engagementId));
    }
  }
  const handleAssignmentClick = (assignmentId: string) => {
    router.push(`/assignments/${assignmentId}`)
  }

  // Placeholder for KPI click navigation
  const handleKpiClick = (engagementTitle: string, kpiType: "findings" | "actions") => {
    // Example: router.push(`/engagements/${engagementId}/${kpiType}`);
    alert(`Navigate to ${kpiType} for ${engagementTitle}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Engagements</h1>
          <p className="text-muted-foreground">Track and manage specific audit engagements.</p>
        </div>
        <Button onClick={() => router.push("/engagements/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Initiate New Engagement
        </Button>
      </div>

      

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Smart search..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-shrink-0">
                  Status: {statusFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["All", "Planning", "In Progress", "On Hold", "Completed"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter === status}
                    onSelect={() => setStatusFilter(status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-shrink-0">
                  Manager: {managerFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Manager</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {engagementManagers.map((manager) => (
                  <DropdownMenuCheckboxItem
                    key={manager}
                    checked={managerFilter === manager}
                    onSelect={() => setManagerFilter(manager)}
                  >
                    {manager}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Engagement Title</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Primary Stakeholder</TableHead>
                <TableHead>Engagement Manager</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Objective</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span>Loading engagements...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEngagements.length > 0 ? (
                filteredEngagements.map((engagement) => (
                  <TableRow key={engagement.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{engagement.title}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {engagement.assignmentCount && engagement.assignmentCount > 0 ? (
                          <div>
                            <div className="font-medium text-primary">{engagement.assignmentCount} assignment{engagement.assignmentCount !== 1 ? 's' : ''}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {engagement.assignmentList && engagement.assignmentList.length > 0 ? (
                                <div className="space-y-1">
                                  {engagement.assignmentList.map((assignment, index) => (
                                    <div
                                      key={assignment.id}
                                      className="cursor-pointer text-blue-400 hover:text-blue-600 hover:underline transition-colors"
                                      onClick={() => handleAssignmentClick(assignment.id)}
                                      title={`Click to view ${assignment.name}`}
                                    >
                                      {assignment.name}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span title={engagement.assignments}>{engagement.assignments}</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No assignments</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{engagement.stakeholder}</TableCell>
                    <TableCell>{engagement.manager}</TableCell>
                                    <TableCell>{engagement.startDate ? new Date(engagement.startDate).toLocaleDateString() : 'Not set'}</TableCell>
                <TableCell>{engagement.endDate ? new Date(engagement.endDate).toLocaleDateString() : 'Not set'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(engagement.status)}>{engagement.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {engagement.objective ? (
                          <div title={engagement.objective} className="truncate max-w-[200px]">
                            {engagement.objective}
                          </div>
                        ) : (
                          <span>No objective set</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu for {engagement.title}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions for {engagement.title}</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDashboard(engagement.id)}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            View Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditEngagement(engagement.id)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Engagement
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateReport(engagement.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleArchiveEngagement(engagement.id)}
                            className="text-red-600 hover:!text-red-600 focus:!text-red-600"
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Archive Engagement
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No engagements found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
