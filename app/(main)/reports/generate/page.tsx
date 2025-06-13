"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-hot-toast"
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  LayoutGrid,
  ListChecks,
  Eye,
  FileDown,
  Save,
  GripVertical,
  PlusCircle,
  X,
  AlertTriangle,
  ShieldCheck,
  Briefcase,
  Settings2,
  CheckCircle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Types
type DataModuleId = "findings" | "actionPlans" | "risks" | "controls" | "assignments"

interface FieldConfig {
  id: string
  label: string
  type: "string" | "date" | "number" | "status" | "assignee" | "riskLevel"
}

interface DataModule {
  id: DataModuleId
  name: string
  icon: LucideIcon
  description: string
  fields: FieldConfig[]
  sampleData: Record<string, any>[]
}

interface FilterConfig {
  id: string
  fieldId: string
  operator: string // e.g., 'equals', 'contains', 'greaterThan', 'dateRange'
  value: any
}

// Mock Data (Simplified)
const ALL_DATA_MODULES: DataModule[] = [
  {
    id: "findings",
    name: "Findings",
    icon: AlertTriangle,
    description: "Report on audit findings, their status, severity, and remediation.",
    fields: [
      { id: "title", label: "Title", type: "string" },
      { id: "status", label: "Status", type: "status" },
      { id: "assignee", label: "Assignee", type: "assignee" },
      { id: "dueDate", label: "Due Date", type: "date" },
      { id: "riskLevel", label: "Risk Level", type: "riskLevel" },
      { id: "description", label: "Description", type: "string" },
      { id: "createdDate", label: "Created Date", type: "date" },
    ],
    sampleData: [
      {
        id: "F001",
        title: "Unpatched Server Vulnerability",
        status: "Open",
        assignee: "IT Team",
        dueDate: "2025-07-15",
        riskLevel: "High",
        description: "Critical server missing security patches.",
        createdDate: "2025-06-01",
      },
      {
        id: "F002",
        title: "Access Control Weakness",
        status: "In Progress",
        assignee: "Security Team",
        dueDate: "2025-08-01",
        riskLevel: "Medium",
        description: "User access reviews overdue.",
        createdDate: "2025-06-10",
      },
    ],
  },
  {
    id: "actionPlans",
    name: "Action Plans",
    icon: ListChecks,
    description: "Track progress and status of action plans for findings.",
    fields: [
      { id: "title", label: "Action Plan Title", type: "string" },
      { id: "status", label: "Status", type: "status" },
      { id: "owner", label: "Owner", type: "assignee" },
      { id: "dueDate", label: "Due Date", type: "date" },
      { id: "findingId", label: "Related Finding ID", type: "string" },
    ],
    sampleData: [
      {
        id: "AP001",
        title: "Patch Server XYZ",
        status: "In Progress",
        owner: "IT Operations",
        dueDate: "2025-07-10",
        findingId: "F001",
      },
      {
        id: "AP002",
        title: "Conduct Access Review",
        status: "Not Started",
        owner: "Security Admin",
        dueDate: "2025-07-20",
        findingId: "F002",
      },
    ],
  },
  {
    id: "risks",
    name: "Risks",
    icon: ShieldCheck, // Using ShieldCheck as a more generic risk icon
    description: "Analyze identified risks, their likelihood, and impact.",
    fields: [
      { id: "title", label: "Risk Title", type: "string" },
      { id: "category", label: "Category", type: "string" },
      { id: "inherentRisk", label: "Inherent Risk", type: "riskLevel" },
      { id: "residualRisk", label: "Residual Risk", type: "riskLevel" },
      { id: "owner", label: "Owner", type: "assignee" },
    ],
    sampleData: [
      {
        id: "R001",
        title: "Data Breach",
        category: "Cybersecurity",
        inherentRisk: "Critical",
        residualRisk: "High",
        owner: "CISO",
      },
      {
        id: "R002",
        title: "Third-party Vendor Failure",
        category: "Operational",
        inherentRisk: "High",
        residualRisk: "Medium",
        owner: "Procurement",
      },
    ],
  },
  {
    id: "controls",
    name: "Controls",
    icon: Settings2, // Using Settings2 as a more generic control icon
    description: "Report on mitigating controls, their type, and effectiveness.",
    fields: [
      { id: "name", label: "Control Name", type: "string" },
      { id: "type", label: "Type", type: "status" }, // e.g. Preventive, Detective
      { id: "effectiveness", label: "Effectiveness", type: "status" },
      { id: "owner", label: "Owner", type: "assignee" },
    ],
    sampleData: [
      {
        id: "C001",
        name: "Firewall Implementation",
        type: "Preventive",
        effectiveness: "Effective",
        owner: "Network Team",
      },
      {
        id: "C002",
        name: "Quarterly Access Reviews",
        type: "Detective",
        effectiveness: "Needs Improvement",
        owner: "Security Team",
      },
    ],
  },
  {
    id: "assignments",
    name: "Assignments",
    icon: Briefcase,
    description: "Overview of audit assignments, their scope, and status.",
    fields: [
      { id: "title", label: "Assignment Title", type: "string" },
      { id: "status", label: "Status", type: "status" },
      { id: "manager", label: "Manager", type: "assignee" },
      { id: "startDate", label: "Start Date", type: "date" },
      { id: "endDate", label: "End Date", type: "date" },
    ],
    sampleData: [
      {
        id: "A001",
        title: "Q3 IT Audit",
        status: "In Progress",
        manager: "Yema Al Olman",
        startDate: "2025-07-01",
        endDate: "2025-09-30",
      },
      {
        id: "A002",
        title: "Financial Controls Review",
        status: "Planning",
        manager: "Khaled M.",
        startDate: "2025-08-01",
        endDate: "2025-10-31",
      },
    ],
  },
]

// Draggable Item Component
interface DraggableFieldProps {
  id: string
  label: string
  isOverlay?: boolean
  onRemove?: (id: string) => void
  isRemovable?: boolean
}

const DraggableField: React.FC<DraggableFieldProps> = ({ id, label, isOverlay, onRemove, isRemovable }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.5 : 1,
    cursor: isOverlay ? "grabbing" : "grab",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-2 my-1 border rounded-md bg-background flex items-center justify-between ${isOverlay ? "shadow-lg" : "hover:bg-muted/50"}`}
    >
      <div className="flex items-center">
        <button {...listeners} className="cursor-grab mr-2 p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        {label}
      </div>
      {isRemovable && onRemove && (
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} className="p-1 h-auto">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default function CustomReportBuilderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedModuleId, setSelectedModuleId] = useState<DataModuleId | null>(null)
  const [selectedFields, setSelectedFields] = useState<FieldConfig[]>([])
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [reportTitle, setReportTitle] = useState("")
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const selectedModule = useMemo(() => ALL_DATA_MODULES.find((m) => m.id === selectedModuleId), [selectedModuleId])

  const availableFields = useMemo(() => {
    if (!selectedModule) return []
    return selectedModule.fields.filter(
      (field) => !selectedFields.find((sf) => sf.id === field.id && sf.label === field.label), // Ensure exact match if IDs could be non-unique across modules
    )
  }, [selectedModule, selectedFields])

  const handleModuleSelect = (moduleId: DataModuleId) => {
    setSelectedModuleId(moduleId)
    setSelectedFields([]) // Reset fields when module changes
    setFilters([]) // Reset filters
    setReportTitle(`Custom Report - ${ALL_DATA_MODULES.find((m) => m.id === moduleId)?.name || "Data"}`)
    setCurrentStep(2)
  }

  const addFieldToReport = (field: FieldConfig) => {
    setSelectedFields((prev) => [...prev, field])
  }

  const removeFieldFromReport = (fieldId: string) => {
    setSelectedFields((prev) => prev.filter((f) => f.id !== fieldId))
  }

  const handleDragStart = (event: DragEndEvent) => {
    setActiveDragId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null)
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSelectedFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addFilter = () => {
    if (!selectedModule || selectedModule.fields.length === 0) return
    // Basic filter: add first field with 'equals' operator
    setFilters((prev) => [
      ...prev,
      {
        id: `filter-${Date.now()}`,
        fieldId: selectedModule.fields[0].id,
        operator: "equals",
        value: "",
      },
    ])
  }

  const updateFilter = (filterId: string, newConfig: Partial<FilterConfig>) => {
    setFilters((prev) => prev.map((f) => (f.id === filterId ? { ...f, ...newConfig } : f)))
  }

  const removeFilter = (filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId))
  }

  const previewData = useMemo(() => {
    if (!selectedModule || selectedFields.length === 0) return []
    let data = selectedModule.sampleData

    // Apply filters (simplified example)
    filters.forEach((filter) => {
      if (filter.value === "" || filter.value === undefined) return
      data = data.filter((row) => {
        const rowValue = String(row[filter.fieldId]).toLowerCase()
        const filterValue = String(filter.value).toLowerCase()
        if (filter.operator === "equals") return rowValue === filterValue
        if (filter.operator === "contains") return rowValue.includes(filterValue)
        // Add more operators as needed
        return true
      })
    })
    return data
  }, [selectedModule, selectedFields, filters])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Select Data Module
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_DATA_MODULES.map((module) => (
              <Card
                key={module.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedModuleId === module.id ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => handleModuleSelect(module.id)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-medium">{module.name}</CardTitle>
                  <module.icon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      case 2: // Configure Report (Columns & Filters)
      case 3: // Preview & Export (Preview is part of configuration)
        if (!selectedModule) {
          return <p>Please select a data module first.</p>
        }
        return (
          <div className="space-y-8">
            {/* Report Title Input */}
            <div>
              <Label htmlFor="reportTitle" className="text-lg font-semibold">
                Report Title
              </Label>
              <Input
                id="reportTitle"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter your report title"
                className="mt-1 text-xl"
              />
            </div>
            <Separator />
            {/* Columns Configuration */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">Select Columns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Available Fields</CardTitle>
                      <CardDescription>Click to add to your report.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-60">
                        {availableFields.map((field) => (
                          <Button
                            key={`${field.id}-${field.label}-avail`} // Ensure unique key
                            variant="outline"
                            className="w-full justify-start mb-2"
                            onClick={() => addFieldToReport(field)}
                          >
                            {field.label}
                          </Button>
                        ))}
                        {availableFields.length === 0 && (
                          <p className="text-sm text-muted-foreground">All fields selected.</p>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Fields in Your Report</CardTitle>
                      <CardDescription>Drag to reorder, click X to remove.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-60">
                        <SortableContext
                          items={selectedFields.map((f) => ({ id: f.id, label: f.label }))}
                          strategy={rectSortingStrategy}
                        >
                          {selectedFields.map((field) => (
                            <DraggableField
                              key={`${field.id}-${field.label}-selected`} // Ensure unique key
                              id={field.id}
                              label={field.label}
                              onRemove={removeFieldFromReport}
                              isRemovable={true}
                            />
                          ))}
                        </SortableContext>
                        {selectedFields.length === 0 && (
                          <p className="text-sm text-muted-foreground">No fields selected. Add fields from the left.</p>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <DragOverlay>
                {activeDragId ? (
                  <DraggableField
                    id={String(activeDragId)}
                    label={selectedFields.find((f) => f.id === activeDragId)?.label || "Field"}
                    isOverlay
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
            <Separator />
            {/* Filters Configuration */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Add Filters</h3>
                <Button variant="outline" size="sm" onClick={addFilter} disabled={selectedFields.length === 0}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Filter
                </Button>
              </div>
              {filters.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No filters applied. Click "Add Filter" to refine your data.
                </p>
              )}
              <div className="space-y-4">
                {filters.map((filter, index) => {
                  const field = selectedModule.fields.find((f) => f.id === filter.fieldId)
                  return (
                    <Card key={filter.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-1">
                          <Label htmlFor={`filter-field-${index}`}>Field</Label>
                          <Select
                            value={filter.fieldId}
                            onValueChange={(value) => updateFilter(filter.id, { fieldId: value, value: "" })} // Reset value on field change
                          >
                            <SelectTrigger id={`filter-field-${index}`}>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedModule.fields.map((f) => (
                                <SelectItem key={f.id} value={f.id}>
                                  {f.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-1">
                          <Label htmlFor={`filter-operator-${index}`}>Operator</Label>
                          <Select
                            value={filter.operator}
                            onValueChange={(value) => updateFilter(filter.id, { operator: value })}
                          >
                            <SelectTrigger id={`filter-operator-${index}`}>
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Basic operators, expand as needed */}
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              {field?.type === "date" && <SelectItem value="dateRange">Date Range</SelectItem>}
                              {/* Add more operators based on field type */}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-1">
                          <Label htmlFor={`filter-value-${index}`}>Value</Label>
                          {filter.operator === "dateRange" ? (
                            <div className="flex gap-2">
                              <DatePicker
                                date={filter.value?.from}
                                onDateChange={(date) =>
                                  updateFilter(filter.id, { value: { ...filter.value, from: date } })
                                }
                                placeholder="From"
                              />
                              <DatePicker
                                date={filter.value?.to}
                                onDateChange={(date) =>
                                  updateFilter(filter.id, { value: { ...filter.value, to: date } })
                                }
                                placeholder="To"
                              />
                            </div>
                          ) : field?.type === "date" && filter.operator !== "dateRange" ? (
                            <DatePicker
                              date={filter.value}
                              onDateChange={(date) => updateFilter(filter.id, { value: date })}
                            />
                          ) : (
                            <Input
                              id={`filter-value-${index}`}
                              value={filter.value || ""}
                              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                              placeholder="Enter filter value"
                            />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFilter(filter.id)}
                          className="self-end text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
            <Separator />
            {/* Live Preview Table */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
              {selectedFields.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[500px] w-full overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {selectedFields.map((field) => (
                              <TableHead key={field.id}>{field.label}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.length > 0 ? (
                            previewData.map((row, rowIndex) => (
                              <TableRow key={`row-${rowIndex}`}>
                                {selectedFields.map((field) => (
                                  <TableCell key={`${field.id}-${rowIndex}`}>
                                    {row[field.id] !== undefined && row[field.id] !== null
                                      ? String(row[field.id])
                                      : "-"}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={selectedFields.length} className="text-center">
                                No data matches your current filters.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-sm text-muted-foreground">Select fields to see a preview.</p>
              )}
            </div>
          </div>
        )
      default:
        return <p>Invalid step.</p>
    }
  }

  const handleExport = (format: "PDF" | "Excel") => {
    toast.success(`Report exported to ${format}! (Placeholder)`)
    console.log("Exporting report:", { title: reportTitle, selectedModuleId, selectedFields, filters, format })
  }

  const handleSaveTemplate = () => {
    toast.success("Report template saved! (Placeholder)")
    console.log("Saving report template:", { title: reportTitle, selectedModuleId, selectedFields, filters })
  }

  const handleGenerateReport = () => {
    // This would typically involve sending the configuration to a backend
    // to generate and store the report, then perhaps navigate to its view page.
    toast.success("Report generated successfully! (Placeholder)")
    console.log("Generating report:", { title: reportTitle, selectedModuleId, selectedFields, filters })
    // Example: router.push('/reports/generated/NEW_REPORT_ID');
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Report Builder</h1>
          <p className="text-muted-foreground">Build and generate custom reports from your audit data.</p>
        </div>
        {currentStep > 1 && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => handleGenerateReport()} disabled={selectedFields.length === 0}>
              <FileText className="h-4 w-4 mr-2" /> Generate Report
            </Button>
            <Button variant="outline" onClick={() => handleExport("PDF")} disabled={selectedFields.length === 0}>
              <FileDown className="h-4 w-4 mr-2" /> Export to PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("Excel")} disabled={selectedFields.length === 0}>
              <FileDown className="h-4 w-4 mr-2" /> Export to Excel
            </Button>
            <Button variant="secondary" onClick={handleSaveTemplate} disabled={selectedFields.length === 0}>
              <Save className="h-4 w-4 mr-2" /> Save Report Template
            </Button>
          </div>
        )}
      </div>

      {/* Step Indicator */}
      <div className="mb-8 p-4 border rounded-lg bg-card">
        <ol className="flex items-center w-full">
          {[
            { id: 1, name: "Select Data Module", icon: LayoutGrid },
            { id: 2, name: "Configure Report", icon: ListChecks },
            { id: 3, name: "Preview & Export", icon: Eye },
          ].map((step, index, arr) => (
            <React.Fragment key={step.id}>
              <li
                className={`flex items-center ${
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                } ${currentStep === step.id ? "font-semibold" : ""}`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 border rounded-full mr-2 shrink-0 ${
                    currentStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                </span>
                <step.icon className="w-5 h-5 mr-2 hidden sm:inline-block" />
                <span className="hidden sm:inline-block">{step.name}</span>
              </li>
              {index < arr.length - 1 && (
                <li className="flex-auto border-t-2 transition duration-500 ease-in-out mx-4 border-muted-foreground"></li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>

      {/* Step Content */}
      <div className="mb-8">{renderStepContent()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Previous Step
        </Button>
        {currentStep < 2 && ( // Only show "Next Step" for step 1, as step 2 and 3 are combined in UI
          <Button
            onClick={() => setCurrentStep((prev) => Math.min(2, prev + 1))} // Go to step 2 (config/preview)
            disabled={currentStep === 2 || (currentStep === 1 && !selectedModuleId)}
          >
            Next Step <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
