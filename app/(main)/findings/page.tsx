"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
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
} from "lucide-react"

import type { Finding, FindingStatus, FindingSeverity, ActionPlanItem } from "./_types/finding-types"
import { mockFindings } from "./_types/finding-types"

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
}

const findingSeverityConfig: Record<FindingSeverity, { color: string; label: string }> = {
  Low: { color: "bg-green-100 text-green-700 border-green-300", label: "Low" },
  Medium: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "Medium" },
  High: { color: "bg-orange-100 text-orange-700 border-orange-300", label: "High" },
  Critical: { color: "bg-red-100 text-red-700 border-red-300", label: "Critical" },
}

const allStatuses = Object.keys(findingStatusConfig) as FindingStatus[]
const allSeverities = Object.keys(findingSeverityConfig) as FindingSeverity[]

// Helper function to determine if a finding is overdue
const isFindingOverdue = (finding: Finding): boolean => {
  if (["Resolved", "Closed", "Rejected"].includes(finding.status)) {
    return false
  }
  if (finding.actionPlan && finding.actionPlan.items) {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Compare dates only

    return finding.actionPlan.items.some((item: ActionPlanItem) => {
      if (item.status === "To Do" || item.status === "In Progress") {
        const dueDate = new Date(item.dueDate)
        return dueDate < today
      }
      return false
    })
  }
  // If no action plan or items, it might be overdue for action plan submission itself.
  // This logic can be expanded. For now, focusing on action item due dates.
  // Example: if status is "Sent to Business Owner" for too long.
  // For simplicity, we'll only check action item due dates.
  return false
}

export default function FindingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [findings, setFindings] = useState<Finding[]>(mockFindings)
  const [showOnlyOverdue, setShowOnlyOverdue] = useState(false)

  const initialStatusFilters = () => {
    const filters = allStatuses.reduce(
      (acc, status) => ({ ...acc, [status]: false }),
      {} as Record<FindingStatus, boolean>,
    )
    const statusFromUrl = searchParams.get("status") as FindingStatus | null
    const filterFromUrl = searchParams.get("filter")

    if (filterFromUrl === "overdue") {
      setShowOnlyOverdue(true)
      // When overdue filter is active, potentially clear other status filters
      // or ensure they don't conflict. For now, overdue takes precedence.
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
    const statusFromUrl = searchParams.get("status") as FindingStatus | null
    const filterFromUrl = searchParams.get("filter")

    if (filterFromUrl === "overdue") {
      setShowOnlyOverdue(true)
      // Clear regular status filters when 'overdue' is active
      setStatusFilters(allStatuses.reduce((acc, status) => ({ ...acc, [status]: false }), {}))
    } else {
      setShowOnlyOverdue(false) // Ensure overdue is off if not in URL
      if (statusFromUrl && allStatuses.includes(statusFromUrl)) {
        const newFilters = allStatuses.reduce(
          (acc, status) => ({ ...acc, [status]: false }),
          {} as Record<FindingStatus, boolean>,
        )
        newFilters[statusFromUrl] = true
        setStatusFilters(newFilters)
      } else if (!statusFromUrl) {
        // No status in URL, ensure all filters are off unless manually set
        // If we want to reset all status filters when no status is in URL:
        // setStatusFilters(allStatuses.reduce((acc, status) => ({ ...acc, [status]: false }), {}));
      }
    }
  }, [searchParams])

  const filteredFindings = useMemo(() => {
    let currentFindings = [...findings]

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
          finding.responsibleBusinessOwner.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    const activeSeverityFilters = allSeverities.filter((severity) => severityFilters[severity])
    if (activeSeverityFilters.length > 0) {
      currentFindings = currentFindings.filter((finding) => activeSeverityFilters.includes(finding.severity))
    }

    return currentFindings
  }, [findings, searchTerm, statusFilters, severityFilters, showOnlyOverdue])

  const handleDeleteFinding = (findingId: string) => {
    setFindings((prevFindings) => prevFindings.filter((f) => f.id !== findingId))
  }

  const navigateToEdit = (findingId: string) => {
    router.push(`/findings/${findingId}/edit`)
  }

  const toggleOverdueFilter = () => {
    const newOverdueState = !showOnlyOverdue
    setShowOnlyOverdue(newOverdueState)
    if (newOverdueState) {
      // When turning on overdue, clear other status filters and update URL
      setStatusFilters(allStatuses.reduce((acc, status) => ({ ...acc, [status]: false }), {}))
      router.push(`/findings?filter=overdue`, { scroll: false })
    } else {
      // When turning off overdue, clear the filter param from URL
      router.push(`/findings`, { scroll: false })
    }
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
                placeholder="Search by ID, title, description, owner..."
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
                    disabled={showOnlyOverdue} // Disable if overdue filter is active
                    onCheckedChange={(checked) => {
                      const newFilters = { ...statusFilters, [status]: !!checked }
                      setStatusFilters(newFilters)
                      setShowOnlyOverdue(false) // Turn off overdue if a status is selected

                      const activeFilters = allStatuses.filter((s) => newFilters[s])
                      if (activeFilters.length === 1 && activeFilters[0] === status && checked) {
                        router.push(`/findings?status=${encodeURIComponent(status)}`, { scroll: false })
                      } else if (!checked && searchParams.get("status") === status) {
                        router.push(`/findings`, { scroll: false })
                      } else if (activeFilters.length === 0 && !checked) {
                        router.push(`/findings`, { scroll: false })
                      }
                      // More complex logic for multiple statuses in URL if needed
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
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[250px]">Finding Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Business Owner</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFindings.length > 0 ? (
                  filteredFindings.map((finding) => {
                    const statusInfo = findingStatusConfig[finding.status]
                    const severityInfo = findingSeverityConfig[finding.severity]
                    const isOverdue = isFindingOverdue(finding) // Check if this specific finding is overdue
                    return (
                      <TableRow
                        key={finding.id}
                        className={isOverdue && !showOnlyOverdue ? "bg-red-50 dark:bg-red-900/30" : ""}
                      >
                        <TableCell className="font-mono text-xs">{finding.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {isOverdue && !showOnlyOverdue && (
                              <AlertTriangle
                                className="h-4 w-4 text-red-500 mr-2 shrink-0"
                                titleAccess="This finding has overdue items"
                              />
                            )}
                            <div
                              className="font-medium truncate max-w-[calc(100%-20px)] sm:max-w-sm md:max-w-md lg:max-w-lg"
                              title={finding.title}
                            >
                              {finding.title}
                            </div>
                          </div>
                          <div
                            className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                            title={finding.description}
                          >
                            {finding.description}
                          </div>
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
                        <TableCell>{new Date(finding.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-5 w-5" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigateToEdit(finding.id)}>
                                <Eye className="mr-2 h-4 w-4" /> View / Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigateToEdit(finding.id)}>
                                <ClipboardEdit className="mr-2 h-4 w-4" /> Manage Action Plan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
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
                    <TableCell colSpan={7} className="h-24 text-center">
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
