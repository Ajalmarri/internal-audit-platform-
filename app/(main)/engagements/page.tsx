"use client"

import * as React from "react"
import { ChevronDown, MoreHorizontal, PlusCircle, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import type { BadgeProps } from "@/components/ui/badge"

type EngagementStatus = "Planning" | "In Progress" | "On Hold" | "Completed"

type Engagement = {
  id: string
  title: string
  stakeholder: string
  manager: string
  startDate: string
  endDate: string
  status: EngagementStatus
}

const mockEngagements: Engagement[] = [
  {
    id: "ENG-001",
    title: "2025 Annual IT Security Audit",
    stakeholder: "IT Department",
    manager: "Yema al Olman",
    startDate: "2025-02-01",
    endDate: "2025-05-31",
    status: "In Progress",
  },
  {
    id: "ENG-002",
    title: "Q3 Financial Systems Review",
    stakeholder: "Finance Department",
    manager: "Khaled M.",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    status: "Planning",
  },
  {
    id: "ENG-003",
    title: "2024 Compliance Check",
    stakeholder: "Legal Department",
    manager: "John Doe",
    startDate: "2024-10-01",
    endDate: "2024-11-30",
    status: "Completed",
  },
  {
    id: "ENG-004",
    title: "Vendor Risk Assessment",
    stakeholder: "Procurement",
    manager: "Yema al Olman",
    startDate: "2025-03-15",
    endDate: "2025-04-30",
    status: "In Progress",
  },
  {
    id: "ENG-005",
    title: "Data Privacy Audit (GDPR)",
    stakeholder: "Compliance Office",
    manager: "Jane Smith",
    startDate: "2025-08-01",
    endDate: "2025-10-31",
    status: "Planning",
  },
  {
    id: "ENG-006",
    title: "Post-Implementation ERP Review",
    stakeholder: "Operations",
    manager: "Khaled M.",
    startDate: "2024-05-01",
    endDate: "2024-07-31",
    status: "Completed",
  },
  {
    id: "ENG-007",
    title: "Business Continuity Plan Test",
    stakeholder: "Risk Management",
    manager: "John Doe",
    startDate: "2025-04-01",
    endDate: "2025-04-15",
    status: "On Hold",
  },
]

const getStatusBadgeVariant = (status: EngagementStatus): BadgeProps["variant"] => {
  switch (status) {
    case "In Progress":
      return "inProgress"
    case "Planning":
      return "secondary"
    case "On Hold":
      return "outline"
    case "Completed":
      return "success"
    default:
      return "default"
  }
}

export default function EngagementsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("All")
  const [managerFilter, setManagerFilter] = React.useState<string>("All")

  const engagementManagers = React.useMemo(() => {
    const managers = new Set(mockEngagements.map((e) => e.manager))
    return ["All", ...Array.from(managers)]
  }, [])

  const filteredEngagements = React.useMemo(() => {
    return mockEngagements.filter((engagement) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      const matchesSearch =
        engagement.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        engagement.stakeholder.toLowerCase().includes(lowerCaseSearchTerm) ||
        engagement.manager.toLowerCase().includes(lowerCaseSearchTerm)

      const matchesStatus = statusFilter === "All" || engagement.status === statusFilter

      const matchesManager = managerFilter === "All" || engagement.manager === managerFilter

      return matchesSearch && matchesStatus && matchesManager
    })
  }, [searchTerm, statusFilter, managerFilter])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Engagements</h1>
          <p className="text-muted-foreground">Track and manage specific audit engagements.</p>
        </div>
        <Button>
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
                <TableHead>Primary Stakeholder</TableHead>
                <TableHead>Engagement Manager</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEngagements.length > 0 ? (
                filteredEngagements.map((engagement) => (
                  <TableRow key={engagement.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{engagement.title}</TableCell>
                    <TableCell>{engagement.stakeholder}</TableCell>
                    <TableCell>{engagement.manager}</TableCell>
                    <TableCell>{engagement.startDate}</TableCell>
                    <TableCell>{engagement.endDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(engagement.status)}>{engagement.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                          <DropdownMenuItem>Edit Engagement</DropdownMenuItem>
                          <DropdownMenuItem>Generate Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
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
