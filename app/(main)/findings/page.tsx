"use client"

import type React from "react"
import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Trash2,
  Eye,
  SlidersHorizontal,
  FileText,
  Hourglass,
  ShieldCheck,
  Send,
  ListChecks,
  CheckCircle2,
  Construction,
  SearchCheck,
  CheckCircle,
  Lock,
  XCircle,
  ClipboardEdit,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react"

import type { Finding, FindingStatus, FindingSeverity, ActionPlanItem } from "./_types/finding-types"

// Interface for database finding
interface FindingFromDB {
  id: string
  title: string
  description?: string
  status?: string
  severity?: string
  assignment_id?: string
  created_at?: string
  updated_at?: string
}

// Convert database finding to display finding
const convertToFinding = (dbFinding: FindingFromDB): Finding => {
  return {
    id: dbFinding.id,
    title: dbFinding.title,
    description: dbFinding.description || '',
    criteria: '', // Mock for now
    condition: '', // Mock for now
    cause: '', // Mock for now
    effect: '', // Mock for now
    recommendation: '', // Mock for now
    status: (dbFinding.status as FindingStatus) || 'Draft',
    severity: (dbFinding.severity as FindingSeverity) || 'Medium',
    associatedRisks: '', // Mock for now
    responsibleBusinessOwner: 'Business Owner', // Mock for now
    dateCreated: dbFinding.created_at || new Date().toISOString(),
    lastUpdated: dbFinding.updated_at || dbFinding.created_at || new Date().toISOString(),
    assignmentName: 'Assignment', // Mock for now
  }
}

const findingStatusConfig: Record<FindingStatus, { icon: React.ElementType; color: string; label: string }> = {
  Draft: { icon: FileText, color: "text-gray-500", label: "Draft" },
  "Pending Verification": { icon: Hourglass, color: "text-yellow-600", label: "Pending Verification" },
  Verified: { icon: ShieldCheck, color: "text-blue-500", label: "Verified" },
  "Sent to Business Owner": { icon: Send, color: "text-purple-500", label: "Sent to BO" },
  "Action Plan Submitted": { icon: ListChecks, color: "text-indigo-500", label: "Action Plan Submitted" },
  "Action Plan Accepted": { icon: CheckCircle2, color: "text-green-500", label: "Action Plan Accepted" },
  "In Remediation": { icon: Construction, color: "text-orange-500", label: "In Remediation" },
  "Remediation Pending Verification": {
    icon: SearchCheck,
    color: "text-teal-500",
    label: "Remediation Pending",
  },
  Resolved: { icon: CheckCircle, color: "text-green-600", label: "Resolved" },
  Closed: { icon: Lock, color: "text-gray-700", label: "Closed" },
  Rejected: { icon: XCircle, color: "text-red-500", label: "Rejected" },
  Open: { icon: AlertTriangle, color: "text-orange-500", label: "Open" },
  "In Progress": { icon: Construction, color: "text-blue-500", label: "In Progress" },
}

const findingSeverityConfig: Record<FindingSeverity, { color: string; label: string }> = {
  Low: { color: "bg-green-100 text-green-700 border-green-300", label: "Low" },
  Medium: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "Medium" },
  High: { color: "bg-orange-100 text-orange-700 border-orange-300", label: "High" },
  Critical: { color: "bg-red-100 text-red-700 border-red-300", label: "Critical" },
}

const allStatuses = Object.keys(findingStatusConfig) as FindingStatus[]
const allSeverities = Object.keys(findingSeverityConfig) as FindingSeverity[]

const isFindingOverdue = (finding: Finding): boolean => {
  if (["Resolved", "Closed", "Rejected"].includes(finding.status)) {
    return false
  }
  if (finding.actionPlan && finding.actionPlan.items) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return finding.actionPlan.items.some((item: ActionPlanItem) => {
      if (item.status === "To Do" || item.status === "In Progress") {
        const dueDate = new Date(item.dueDate)
        return dueDate < today
      }
      return false
    })
  }
  return false
}

const getActionPlanProgressValue = (finding: Finding): number => {
  if (finding.id === "FND002" && finding.status === "Action Plan Submitted") return 25
  if (finding.id === "FND003" && finding.status === "Action Plan Accepted") return 10
  return 0
}

type SortableColumn =
  | keyof Pick<
      Finding,
      "id" | "title" | "status" | "severity" | "responsibleBusinessOwner" | "lastUpdated" | "assignmentName"
    >
  | "actionPlanProgress"

export default function FindingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [findings, setFindings] = useState<Finding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOnlyOverdue, setShowOnlyOverdue] = useState(false)

  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const initialStatusFilters = () => {
    const filters = allStatuses.reduce(
      (acc, status) => ({ ...acc, [status]: false }),
      {} as Record<FindingStatus, boolean>,
    )
    const statusFromUrl = searchParams.get("status") as FindingStatus | null
    const filterFromUrl = searchParams.get("filter")

    if (filterFromUrl === "overdue") {
      setShowOnlyOverdue(true)
      return filters
    } else if (statusFromUrl && allStatuses.includes(statusFromUrl)) {
      filters[statusFromUrl] = true
      setShowOnlyOverdue(false)
    } else {
      setShowOnlyOverdue(false)
    }
    return filters
  }

  const [statusFilters, setStatusFilters] = useState<Record<FindingStatus, boolean>>(initialStatusFilters)
  const [severityFilters, setSeverityFilters] = useState<Record<FindingSeverity, boolean>>(
    allSeverities.reduce((acc, severity) => ({ ...acc, [severity]: false }), {} as Record<FindingSeverity, boolean>),
  )

  useEffect(() => {
    const fetchFindings = async () => {
      try {
        setLoading(true)
        // Fetch findings and assignments from our local API (backed by MySQL)
        const [findingsRes, assignmentsRes] = await Promise.all([
          fetch('/api/findings'),
          fetch('/api/assignments'),
        ])

        if (!findingsRes.ok) throw new Error(`Findings fetch failed: ${findingsRes.status}`)
        if (!assignmentsRes.ok) throw new Error(`Assignments fetch failed: ${assignmentsRes.status}`)

        const [findingsData, assignmentsData] = await Promise.all<[
          FindingFromDB[],
          { id: string; title: string }[]
        ]>([findingsRes.json(), assignmentsRes.json()])

        const assignmentIdToName = new Map<string, string>()
        assignmentsData.forEach((a) => {
          if (a?.id && a?.title) assignmentIdToName.set(a.id, a.title)
        })

        const converted = findingsData.map((db) => {
          const f = convertToFinding(db)
          // Enrich with assignment links if available
          if (db.assignment_id) {
            ;(f as any).assignmentId = db.assignment_id
            ;(f as any).assignmentName = assignmentIdToName.get(db.assignment_id) || undefined
          }
          return f
        })

        setFindings(converted)
      } catch (err) {
        setError("Failed to fetch findings.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFindings()
  }, [])

  useEffect(() => {
    const statusFromUrl = searchParams.get("status") as FindingStatus | null
    const filterFromUrl = searchParams.get("filter")

    if (filterFromUrl === "overdue") {
      setShowOnlyOverdue(true)
      setStatusFilters(allStatuses.reduce((acc, status) => ({ ...acc, [status]: false }), {} as Record<FindingStatus, boolean>))
    } else {
      setShowOnlyOverdue(false)
      if (statusFromUrl && allStatuses.includes(statusFromUrl)) {
        const newFilters = allStatuses.reduce(
          (acc, status) => ({ ...acc, [status]: false }),
          {} as Record<FindingStatus, boolean>,
        )
        newFilters[statusFromUrl] = true
        setStatusFilters(newFilters)
      }
    }
  }, [searchParams])

  const handleSort = useCallback(
    (column: SortableColumn) => {
      if (sortColumn === column) {
        setSortDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"))
      } else {
        setSortColumn(column)
        setSortDirection("asc")
      }
    },
    [sortColumn],
  )

  const filteredAndSortedFindings = useMemo(() => {
    let currentFindings = [...findings]

    // Filtering logic
    if (showOnlyOverdue) {
      currentFindings = currentFindings.filter(isFindingOverdue)
    } else {
      const activeStatusFilters = allStatuses.filter((status) => statusFilters[status])
      if (activeStatusFilters.length > 0) {
        currentFindings = currentFindings.filter((finding) => activeStatusFilters.includes(finding.status))
      }
    }

    if (searchTerm) {
      currentFindings = currentFindings.filter(
        (finding) =>
          finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          finding.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          finding.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (finding.assignmentName && finding.assignmentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          finding.responsibleBusinessOwner.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    const activeSeverityFilters = allSeverities.filter((severity) => severityFilters[severity])
    if (activeSeverityFilters.length > 0) {
      currentFindings = currentFindings.filter((finding) => activeSeverityFilters.includes(finding.severity))
    }

    // Sorting logic
    if (sortColumn) {
      currentFindings.sort((a, b) => {
        let valA: string | number | undefined
        let valB: string | number | undefined

        if (sortColumn === "actionPlanProgress") {
          valA = getActionPlanProgressValue(a)
          valB = getActionPlanProgressValue(b)
        } else if (sortColumn === "assignmentName") {
          valA = a.assignmentName?.toLowerCase() || ""
          valB = b.assignmentName?.toLowerCase() || ""
        } else {
          valA = a[sortColumn as keyof Finding] as string | number | undefined
          valB = b[sortColumn as keyof Finding] as string | number | undefined
        }

        // Handle undefined or null for general string/number comparison
        if (valA === undefined || valA === null || (typeof valA === "number" && valA === -1))
          valA = sortDirection === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
        if (valB === undefined || valB === null || (typeof valB === "number" && valB === -1))
          valB = sortDirection === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY

        if (typeof valA === "string" && typeof valB === "string") {
          return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA
        }
        return 0
      })
    }

    return currentFindings
  }, [findings, searchTerm, statusFilters, severityFilters, showOnlyOverdue, sortColumn, sortDirection])

  const handleDeleteFinding = async (findingId: string) => {
    if (!confirm('Are you sure you want to delete this finding? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/findings/${findingId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`HTTP error! status: ${response.status}${errorData.message ? `: ${errorData.message}` : ''}`)
      }
      
      const result = await response.json()
      console.log('Finding deleted successfully:', result)
      
      // Remove from local state
      setFindings((prevFindings) => prevFindings.filter((f) => f.id !== findingId))
      
      // Show success message
      toast({
        title: "Finding Deleted",
        description: "The finding has been successfully deleted.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete finding."
      setError(errorMessage)
      console.error('Delete finding error:', err)
      
      // Show error toast
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const navigateToEdit = (findingId: string) => {
    router.push(`/findings/${findingId}/edit`)
  }

  const toggleOverdueFilter = () => {
    const newOverdueState = !showOnlyOverdue
    setShowOnlyOverdue(newOverdueState)
    if (newOverdueState) {
              setStatusFilters(allStatuses.reduce((acc, status) => ({ ...acc, [status]: false }), {} as Record<FindingStatus, boolean>))
      router.push(`/findings?filter=overdue`, { scroll: false })
    } else {
      router.push(`/findings`, { scroll: false })
    }
  }

  const renderSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getActionPlanProgressDisplay = (finding: Finding) => {
    const progress = getActionPlanProgressValue(finding)
    if (progress === -1) return <span className="text-muted-foreground">N/A</span>
    return (
      <div className="flex items-center gap-2">
        <Progress value={progress} className="h-2 w-[60px]" />
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
    )
  }

  if (loading && !findings.length) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="ml-2 text-lg text-muted-foreground">Loading findings...</p>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (findings.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">No findings found. Create a new one!</p>
        <Button className="mt-4" onClick={() => router.push("/findings/new")}>
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Finding
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-foreground">Manage Audit Findings</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/findings/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Finding
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Findings List</CardTitle>
          <CardDescription>Browse, search, and manage all documented audit findings.</CardDescription>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by ID, title, assignment, owner..."
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
              <DropdownMenuContent align="end" className="w-[250px]">
                <DropdownMenuLabel>Special Filters</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked={showOnlyOverdue} onCheckedChange={toggleOverdueFilter}>
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500" /> Overdue Findings
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                {allStatuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilters[status]}
                    disabled={showOnlyOverdue}
                    onCheckedChange={(checked) => {
                      const newFilters = { ...statusFilters, [status]: !!checked }
                      setStatusFilters(newFilters)
                      setShowOnlyOverdue(false)

                      const activeFilters = allStatuses.filter((s) => newFilters[s])
                      if (activeFilters.length === 1 && activeFilters[0] === status && checked) {
                        router.push(`/findings?status=${encodeURIComponent(status)}`, { scroll: false })
                      } else if (!checked && searchParams.get("status") === status) {
                        router.push(`/findings`, { scroll: false })
                      } else if (activeFilters.length === 0 && !checked) {
                        router.push(`/findings`, { scroll: false })
                      }
                    }}
                  >
                    {findingStatusConfig[status].label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
                {allSeverities.map((severity) => (
                  <DropdownMenuCheckboxItem
                    key={severity}
                    checked={severityFilters[severity]}
                    onCheckedChange={(checked) => setSeverityFilters((prev) => ({ ...prev, [severity]: !!checked }))}
                  >
                    {findingSeverityConfig[severity].label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {showOnlyOverdue && (
            <Badge variant="destructive" className="mt-2">
              <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
              Showing Overdue Findings
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("id")}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      ID {renderSortIcon("id")}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[250px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("title")}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      Finding Title {renderSortIcon("title")}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[180px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("assignmentName")}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      Parent Assignment {renderSortIcon("assignmentName")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("status")}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      Status {renderSortIcon("status")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("severity")}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      Severity {renderSortIcon("severity")}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("responsibleBusinessOwner")}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      Business Owner {renderSortIcon("responsibleBusinessOwner")}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("actionPlanProgress")}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      Action Plan Progress {renderSortIcon("actionPlanProgress")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("lastUpdated")}
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                      Last Updated {renderSortIcon("lastUpdated")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right sticky right-0 bg-card z-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedFindings.length > 0 ? (
                  filteredAndSortedFindings.map((finding) => {
                    const statusInfo = findingStatusConfig[finding.status]
                    const severityInfo = findingSeverityConfig[finding.severity]
                    const isOverdue = isFindingOverdue(finding)
                    return (
                      <TableRow
                        key={finding.id}
                        className={isOverdue && !showOnlyOverdue ? "bg-red-50 dark:bg-red-900/30" : ""}
                      >
                        <TableCell className="font-mono text-xs">
                          <Link
                            href={`/findings/${finding.id}`}
                            className="hover:underline text-blue-600 dark:text-blue-400"
                          >
                            {finding.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {isOverdue && !showOnlyOverdue && (
                              <span title="This finding has overdue items">
                                <AlertTriangle
                                  className="h-4 w-4 text-red-500 mr-2 shrink-0"
                                />
                              </span>
                            )}
                            <div
                              className="font-medium truncate max-w-[calc(100%-20px)] sm:max-w-xs md:max-w-sm lg:max-w-md"
                              title={finding.title}
                            >
                              {finding.title}
                            </div>
                          </div>
                          <div
                            className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-xs md:max-w-sm lg:max-w-md"
                            title={finding.description}
                          >
                            {finding.description}
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-[180px]">
                          {finding.assignmentId && finding.assignmentName ? (
                            <Link
                              href={`/assignments/${finding.assignmentId}`}
                              className="hover:underline text-blue-600 dark:text-blue-400"
                              title={finding.assignmentName}
                            >
                              {finding.assignmentName}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground italic">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              finding.status === "Closed" || finding.status === "Rejected" ? "outline" : "secondary"
                            }
                            className={`whitespace-nowrap ${
                              finding.status === "Closed" || finding.status === "Rejected" ? "border-gray-400" : ""
                            }`}
                          >
                            <statusInfo.icon className={`mr-1.5 h-3.5 w-3.5 ${statusInfo.color}`} />
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${severityInfo.color} whitespace-nowrap`}>
                            {severityInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="truncate max-w-[150px]" title={finding.responsibleBusinessOwner}>
                          {finding.responsibleBusinessOwner}
                        </TableCell>
                        <TableCell>{getActionPlanProgressDisplay(finding)}</TableCell>
                        <TableCell>{new Date(finding.lastUpdated).toLocaleDateString()}</TableCell>
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
                                <Link href={`/findings/${finding.id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigateToEdit(finding.id)}>
                                <ClipboardEdit className="mr-2 h-4 w-4" /> Edit Finding
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-700/20"
                                onClick={() => handleDeleteFinding(finding.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Finding
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No findings match your criteria.
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
