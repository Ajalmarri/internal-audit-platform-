"use client"

import type { NextPage } from "next"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, PlusCircle, AlertTriangle, CheckCircle2, XCircle, ListFilter } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type ControlType = "Preventive" | "Detective" | "Corrective"
type ControlStatus = "Active" | "Inactive" | "Draft"
type ControlEffectiveness = "Effective" | "Needs Improvement" | "Ineffective" | "Not Assessed"

interface Control {
  id: string
  name: string
  description: string
  type: ControlType
  status: ControlStatus
  effectiveness: ControlEffectiveness
  linkedRisksCount: number
  lastAssessed?: string
}

const mockControls: Control[] = [
  {
    id: "ctrl_001",
    name: "Quarterly Vulnerability Scanning",
    description: "Automated scans of all external-facing systems to identify potential weaknesses.",
    type: "Detective",
    status: "Active",
    effectiveness: "Effective",
    linkedRisksCount: 3,
    lastAssessed: "2025-05-15",
  },
  {
    id: "ctrl_002",
    name: "Segregation of Duties Policy",
    description: "Ensures no single individual has control over all aspects of a financial transaction.",
    type: "Preventive",
    status: "Active",
    effectiveness: "Effective",
    linkedRisksCount: 5,
    lastAssessed: "2025-04-20",
  },
  {
    id: "ctrl_003",
    name: "New Vendor Onboarding Approval",
    description: "Requires dual approval for all new vendor contracts and security assessments.",
    type: "Preventive",
    status: "Active",
    effectiveness: "Needs Improvement",
    linkedRisksCount: 2,
    lastAssessed: "2025-06-01",
  },
  {
    id: "ctrl_004",
    name: "Incident Response Plan",
    description: "Documented plan for responding to security incidents, including roles and responsibilities.",
    type: "Corrective",
    status: "Active",
    effectiveness: "Effective",
    linkedRisksCount: 4,
    lastAssessed: "2025-03-10",
  },
  {
    id: "ctrl_005",
    name: "Data Backup and Recovery",
    description: "Regular backups of critical data and tested recovery procedures.",
    type: "Corrective",
    status: "Active",
    effectiveness: "Effective",
    linkedRisksCount: 6,
    lastAssessed: "2025-05-01",
  },
  {
    id: "ctrl_006",
    name: "Access Control Reviews",
    description: "Periodic review of user access rights to ensure least privilege.",
    type: "Detective",
    status: "Inactive",
    effectiveness: "Not Assessed",
    linkedRisksCount: 0,
  },
  {
    id: "ctrl_007",
    name: "Security Awareness Training",
    description: "Mandatory annual training for all employees on security best practices.",
    type: "Preventive",
    status: "Active",
    effectiveness: "Needs Improvement",
    linkedRisksCount: 7,
    lastAssessed: "2025-01-30",
  },
]

const getControlTypeBadgeVariant = (type: ControlType): "default" | "secondary" | "outline" => {
  switch (type) {
    case "Preventive":
      return "default"
    case "Detective":
      return "secondary"
    case "Corrective":
      return "outline"
    default:
      return "default"
  }
}

const getControlStatusBadgeVariant = (status: ControlStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Active":
      return "default"
    case "Inactive":
      return "secondary"
    case "Draft":
      return "outline"
    default:
      return "default"
  }
}

const getControlEffectivenessBadgeVariant = (
  effectiveness: ControlEffectiveness,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (effectiveness) {
    case "Effective":
      return "default" // Greenish in theme
    case "Needs Improvement":
      return "secondary" // Yellowish/Orangeish in theme
    case "Ineffective":
      return "destructive" // Reddish in theme
    case "Not Assessed":
      return "outline"
    default:
      return "default"
  }
}

const ControlsPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterControlType, setFilterControlType] = useState<ControlType | "All">("All")
  const [filterStatus, setFilterStatus] = useState<ControlStatus | "All">("All")
  const [filterEffectiveness, setFilterEffectiveness] = useState<ControlEffectiveness | "All">("All")
  const [filterHasLinkedRisks, setFilterHasLinkedRisks] = useState<"Any" | "Yes" | "No">("Any")

  const filteredControls = useMemo(() => {
    return mockControls.filter((control) => {
      const searchMatch =
        control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.description.toLowerCase().includes(searchTerm.toLowerCase())
      const controlTypeMatch = filterControlType === "All" || control.type === filterControlType
      const statusMatch = filterStatus === "All" || control.status === filterStatus
      const effectivenessMatch = filterEffectiveness === "All" || control.effectiveness === filterEffectiveness
      const linkedRisksMatch =
        filterHasLinkedRisks === "Any" ||
        (filterHasLinkedRisks === "Yes" && control.linkedRisksCount > 0) ||
        (filterHasLinkedRisks === "No" && control.linkedRisksCount === 0)

      return searchMatch && controlTypeMatch && statusMatch && effectivenessMatch && linkedRisksMatch
    })
  }, [searchTerm, filterControlType, filterStatus, filterEffectiveness, filterHasLinkedRisks])

  return (
    <div className="flex flex-col h-full">
      <header className="bg-background border-b p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Controls Library</h1>
            <p className="text-sm text-muted-foreground">Manage all mitigating controls across the organization.</p>
          </div>
          <Link href="/controls/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Control
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search controls by name or description..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-grow sm:flex-grow-0">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Type: {filterControlType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={filterControlType}
                  onValueChange={(value) => setFilterControlType(value as ControlType | "All")}
                >
                  <DropdownMenuRadioItem value="All">All Types</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Preventive">Preventive</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Detective">Detective</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Corrective">Corrective</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-grow sm:flex-grow-0">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Status: {filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as ControlStatus | "All")}
                >
                  <DropdownMenuRadioItem value="All">All Statuses</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Active">Active</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Inactive">Inactive</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Draft">Draft</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-grow sm:flex-grow-0">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Effectiveness: {filterEffectiveness}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={filterEffectiveness}
                  onValueChange={(value) => setFilterEffectiveness(value as ControlEffectiveness | "All")}
                >
                  <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Effective">Effective</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Needs Improvement">Needs Improvement</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ineffective">Ineffective</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Not Assessed">Not Assessed</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-grow sm:flex-grow-0">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Linked Risks: {filterHasLinkedRisks}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={filterHasLinkedRisks}
                  onValueChange={(value) => setFilterHasLinkedRisks(value as "Any" | "Yes" | "No")}
                >
                  <DropdownMenuRadioItem value="Any">Any</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Yes">Has Linked Risks</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="No">No Linked Risks</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Separator />
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effectiveness</TableHead>
                <TableHead className="text-center">Linked Risks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredControls.length > 0 ? (
                filteredControls.map((control) => (
                  <TableRow key={control.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{control.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell truncate max-w-xs">
                      {control.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getControlTypeBadgeVariant(control.type)}>{control.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getControlStatusBadgeVariant(control.status)}>{control.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getControlEffectivenessBadgeVariant(control.effectiveness)}>
                        {control.effectiveness === "Effective" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {control.effectiveness === "Needs Improvement" && <AlertTriangle className="mr-1 h-3 w-3" />}
                        {control.effectiveness === "Ineffective" && <XCircle className="mr-1 h-3 w-3" />}
                        {control.effectiveness}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{control.linkedRisksCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Control Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Control</DropdownMenuItem>
                          <DropdownMenuItem>Assess Effectiveness</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete Control</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No controls found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredControls.length} of {mockControls.length} controls.
        </p>
      </div>
    </div>
  )
}

export default ControlsPage
