"use client"

import type React from "react"

import { useState } from "react"
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
import {
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type RiskStatus = "Open" | "Mitigated" | "Accepted" | "Closed"
type RiskRating = "Low" | "Medium" | "High" | "Critical"
type RiskCategory = "Enterprise" | "Operational" | "Financial" | "Compliance" | "Strategic"

interface Risk {
  id: string
  title: string
  description: string
  categories: RiskCategory[]
  status: RiskStatus
  inherentRisk: RiskRating
  residualRisk: RiskRating
  lastUpdated: string
  // Placeholder for controls information
  controlsCount?: number
}

const mockRisks: Risk[] = [
  {
    id: "RISK001",
    title: "Data Breach due to Unpatched Systems",
    description:
      "Potential unauthorized access to sensitive customer data through vulnerabilities in unpatched software.",
    categories: ["Operational", "Enterprise"],
    status: "Open",
    inherentRisk: "Critical",
    residualRisk: "High",
    lastUpdated: "2025-05-28",
    controlsCount: 3,
  },
  {
    id: "RISK002",
    title: "Financial Misstatement from Manual Errors",
    description:
      "Risk of errors in financial reporting due to reliance on manual data entry and reconciliation processes.",
    categories: ["Financial", "Operational"],
    status: "Mitigated",
    inherentRisk: "High",
    residualRisk: "Low",
    lastUpdated: "2025-05-15",
    controlsCount: 5,
  },
  {
    id: "RISK003",
    title: "Regulatory Non-Compliance with GDPR",
    description: "Failure to adhere to GDPR requirements leading to potential fines and reputational damage.",
    categories: ["Compliance", "Enterprise"],
    status: "Open",
    inherentRisk: "High",
    residualRisk: "Medium",
    lastUpdated: "2025-06-01",
    controlsCount: 2,
  },
  {
    id: "RISK004",
    title: "Supply Chain Disruption",
    description: "Disruption in key supply chains affecting operational continuity and product delivery.",
    categories: ["Strategic", "Operational"],
    status: "Accepted",
    inherentRisk: "Medium",
    residualRisk: "Medium",
    lastUpdated: "2025-04-20",
    controlsCount: 1,
  },
  {
    id: "RISK005",
    title: "Outdated IT Infrastructure",
    description: "Legacy IT systems are becoming unreliable and difficult to maintain, posing operational risks.",
    categories: ["Operational"],
    status: "Closed",
    inherentRisk: "Medium",
    residualRisk: "Low",
    lastUpdated: "2025-03-10",
    controlsCount: 4,
  },
]

const statusConfig: Record<RiskStatus, { icon: React.ElementType; color: string; label: string }> = {
  Open: { icon: AlertTriangle, color: "text-yellow-500", label: "Open" },
  Mitigated: { icon: ShieldCheck, color: "text-blue-500", label: "Mitigated" },
  Accepted: { icon: CheckCircle, color: "text-green-500", label: "Accepted" },
  Closed: { icon: XCircle, color: "text-gray-500", label: "Closed" },
}

const ratingConfig: Record<RiskRating, { color: string; label: string }> = {
  Low: { color: "bg-green-100 text-green-700 border-green-300", label: "Low" },
  Medium: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", label: "Medium" },
  High: { color: "bg-orange-100 text-orange-700 border-orange-300", label: "High" },
  Critical: { color: "bg-red-100 text-red-700 border-red-300", label: "Critical" },
}

const allCategories: RiskCategory[] = ["Enterprise", "Operational", "Financial", "Compliance", "Strategic"]
const allStatuses: RiskStatus[] = ["Open", "Mitigated", "Accepted", "Closed"]
const allRatings: RiskRating[] = ["Low", "Medium", "High", "Critical"]

export default function RisksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRisks, setFilteredRisks] = useState<Risk[]>(mockRisks)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null)

  // Placeholder for filter state
  const [statusFilters, setStatusFilters] = useState<Record<RiskStatus, boolean>>({
    Open: false,
    Mitigated: false,
    Accepted: false,
    Closed: false,
  })
  const [categoryFilters, setCategoryFilters] = useState<Record<RiskCategory, boolean>>({
    Enterprise: false,
    Operational: false,
    Financial: false,
    Compliance: false,
    Strategic: false,
  })

  // TODO: Implement actual filtering logic based on searchTerm, statusFilters, categoryFilters
  // This is a simplified search for demonstration
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term) {
      setFilteredRisks(mockRisks)
      return
    }
    setFilteredRisks(
      mockRisks.filter(
        (risk) =>
          risk.title.toLowerCase().includes(term.toLowerCase()) ||
          risk.description.toLowerCase().includes(term.toLowerCase()),
      ),
    )
  }

  const openAddRiskForm = () => {
    setEditingRisk(null)
    setIsFormOpen(true)
  }

  const openEditRiskForm = (risk: Risk) => {
    setEditingRisk(risk)
    setIsFormOpen(true)
  }

  // Placeholder for delete action
  const handleDeleteRisk = (riskId: string) => {
    console.log("Delete risk:", riskId)
    // Implement actual deletion logic
    setFilteredRisks(filteredRisks.filter((r) => r.id !== riskId))
  }

  // Placeholder for form submission
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newRiskData = {
      id: editingRisk ? editingRisk.id : `RISK${String(mockRisks.length + 1).padStart(3, "0")}`,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      categories: allCategories.filter((cat) => formData.get(cat)), // Simplified
      status: formData.get("status") as RiskStatus,
      inherentRisk: formData.get("inherentRisk") as RiskRating,
      residualRisk: formData.get("residualRisk") as RiskRating,
      lastUpdated: new Date().toISOString().split("T")[0],
    }
    // TODO: Add/Update risk in mockRisks or backend
    console.log("Form submitted:", newRiskData)
    setIsFormOpen(false)
    setEditingRisk(null)
    // For demo, just re-filter or re-fetch
    handleSearch(searchTerm)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-foreground">Manage Risks</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddRiskForm} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Risk
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingRisk ? "Edit Risk" : "Add New Risk"}</DialogTitle>
              <DialogDescription>
                {editingRisk ? "Update the details of the existing risk." : "Fill in the details for the new risk."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingRisk?.title || ""}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingRisk?.description || ""}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Categories</Label>
                  <div className="col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allCategories.map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox id={cat} name={cat} defaultChecked={editingRisk?.categories.includes(cat)} />
                        <Label htmlFor={cat} className="font-normal">
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingRisk?.status || "Open"}
                    className="col-span-3 p-2 border rounded-md"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inherentRisk" className="text-right">
                    Inherent Risk
                  </Label>
                  <select
                    id="inherentRisk"
                    name="inherentRisk"
                    defaultValue={editingRisk?.inherentRisk || "Medium"}
                    className="col-span-3 p-2 border rounded-md"
                  >
                    {allRatings.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="residualRisk" className="text-right">
                    Residual Risk
                  </Label>
                  <select
                    id="residualRisk"
                    name="residualRisk"
                    defaultValue={editingRisk?.residualRisk || "Low"}
                    className="col-span-3 p-2 border rounded-md"
                  >
                    {allRatings.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingRisk ? "Save Changes" : "Create Risk"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Library</CardTitle>
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search risks by title or description..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
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
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allStatuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilters[status]}
                    onCheckedChange={(checked) => setStatusFilters((prev) => ({ ...prev, [status]: !!checked }))}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuLabel className="mt-2">Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allCategories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={categoryFilters[category]}
                    onCheckedChange={(checked) => setCategoryFilters((prev) => ({ ...prev, [category]: !!checked }))}
                  >
                    {category}
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
                  <TableHead className="w-[250px]">Risk Title</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Inherent Risk</TableHead>
                  <TableHead>Residual Risk</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRisks.length > 0 ? (
                  filteredRisks.map((risk) => {
                    const StatusIcon = statusConfig[risk.status].icon
                    const statusColor = statusConfig[risk.status].color
                    return (
                      <TableRow key={risk.id}>
                        <TableCell>
                          <div className="font-medium truncate w-60" title={risk.title}>
                            {risk.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate w-60" title={risk.description}>
                            {risk.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {risk.categories.map((category) => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                            <span className={statusColor}>{statusConfig[risk.status].label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={ratingConfig[risk.inherentRisk].color}>
                            {ratingConfig[risk.inherentRisk].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={ratingConfig[risk.residualRisk].color}>
                            {ratingConfig[risk.residualRisk].label}
                          </Badge>
                        </TableCell>
                        <TableCell>{risk.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-5 w-5" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log("View details for", risk.id)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditRiskForm(risk)}>
                                <Edit3 className="mr-2 h-4 w-4" /> Edit Risk
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Manage controls for", risk.id)}>
                                <Filter className="mr-2 h-4 w-4" /> Manage Controls ({risk.controlsCount || 0})
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteRisk(risk.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Risk
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
                      No risks found.
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
