"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus, Link as LinkIcon, Users, AlertTriangle, Trash2, Edit, Calendar, Target, Shield } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { toast } from "@/components/ui/use-toast"

interface UserStub {
  id: string
  name: string
  avatar?: string
  email?: string
  role?: string
}

interface Risk {
  id: string
  title: string
  description: string
  likelihood: string
  impact: string
  inherent_risk: string
  category?: string
  owner?: string
  status: string
}

interface Control {
  id: string
  name: string
  description: string
  type: string
  effectiveness: string
  last_assessed?: string
}

interface Task {
  id: string
  description: string
  assigneeId?: string
  dueDate?: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Pending" | "In Progress" | "Completed" | "Blocked"
}

type RiskRating = "Low" | "Medium" | "High" | "Critical"

const mockRequirementTypes: string[] = [
  "Regulatory Compliance",
  "Financial Audit",
  "Operational Review",
  "IT Security Assessment",
  "Process Improvement",
  "Risk Assessment",
  "Control Testing",
  "Compliance Review"
]

const riskRatingOptions: RiskRating[] = ["Low", "Medium", "High", "Critical"]
const priorityOptions: Task["priority"][] = ["Low", "Medium", "High", "Critical"]
const taskStatusOptions: Task["status"][] = ["Pending", "In Progress", "Completed", "Blocked"]

const assignmentStages: string[] = ["Planning", "Preparation", "Fieldwork", "Reporting", "Follow-up"]

interface AuditPlanOption {
  id: string
  title: string
}

interface NewAssignmentFormState {
  title: string
  description: string
  parentAuditPlanId?: string
  requirementType: string
  riskLikelihood: RiskRating
  impact: RiskRating
  inherentRisk: RiskRating
  assignedTeamMembers: UserStub[]
  linkedRisks: Risk[]
  linkedControls: Control[]
  tasks: Task[]
  startDate?: string
  endDate?: string
}

const initialFormState: NewAssignmentFormState = {
  title: "",
  description: "",
  parentAuditPlanId: undefined,
  requirementType: mockRequirementTypes[0] || "",
  riskLikelihood: "Medium",
  impact: "Medium",
  inherentRisk: "Medium",
  assignedTeamMembers: [],
  linkedRisks: [],
  linkedControls: [],
  tasks: [],
}

export default function CreateNewAssignmentPage() {
  const router = useRouter()
  const [formState, setFormState] = useState<NewAssignmentFormState>(initialFormState)
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false)
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false)
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [selectedTeamMemberIds, setSelectedTeamMemberIds] = useState<Set<string>>(new Set())
  const [selectedRiskIds, setSelectedRiskIds] = useState<Set<string>>(new Set())
  const [selectedControlIds, setSelectedControlIds] = useState<Set<string>>(new Set())

  const [availableAuditPlans, setAvailableAuditPlans] = useState<AuditPlanOption[]>([])
  const [availableTeamMembers, setAvailableTeamMembers] = useState<UserStub[]>([])
  const [availableRisks, setAvailableRisks] = useState<Risk[]>([])
  const [availableControls, setAvailableControls] = useState<Control[]>([])
  const [isLoadingAuditPlans, setIsLoadingAuditPlans] = useState(false)
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false)
  const [isLoadingRisks, setIsLoadingRisks] = useState(false)
  const [isLoadingControls, setIsLoadingControls] = useState(false)
  const [auditPlansError, setAuditPlansError] = useState<string | null>(null)
  const [teamMembersError, setTeamMembersError] = useState<string | null>(null)

  // Task form state
  const [newTask, setNewTask] = useState<Partial<Task>>({
    description: "",
    assigneeId: "unassigned",
    dueDate: "",
    priority: "Medium",
    status: "Pending"
  })

  useEffect(() => {
    const fetchAuditPlans = async () => {
      setIsLoadingAuditPlans(true)
      setAuditPlansError(null)
      try {
        const response = await fetch("/api/audit-plans")
        if (!response.ok) {
          let apiErrorMsg = `Error ${response.status}: ${response.statusText || "Failed to fetch audit plans"}`
          try {
            const errorData = await response.json()
            if (errorData && errorData.message) {
              apiErrorMsg = errorData.message
            }
          } catch (e) {
            // Ignore if error response is not JSON or parsing fails
          }
          throw new Error(apiErrorMsg)
        }
        const data: AuditPlanOption[] = await response.json()
        setAvailableAuditPlans(data)
      } catch (error) {
        console.error("Client-side error fetching audit plans:", error)
        setAuditPlansError((error as Error).message || "An unknown client-side error occurred")
      } finally {
        setIsLoadingAuditPlans(false)
      }
    }

    const fetchTeamMembers = async () => {
      setIsLoadingTeamMembers(true)
      setTeamMembersError(null)
      try {
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error(`Failed to fetch team members: ${response.status}`)
        }
        const data: UserStub[] = await response.json()
        const usersWithAvatars = data.map(user => ({
          ...user,
          avatar: "/placeholder.svg?width=40&height=40"
        }))
        setAvailableTeamMembers(usersWithAvatars)
      } catch (error) {
        console.error("Error fetching team members:", error)
        setTeamMembersError((error as Error).message || "Failed to fetch team members")
      } finally {
        setIsLoadingTeamMembers(false)
      }
    }

    const fetchRisks = async () => {
      setIsLoadingRisks(true)
      try {
        // For now, we'll use the risks from setup-risks.js
        // In a real implementation, you'd have an API endpoint for this
        const mockRisks: Risk[] = [
          { id: "RISK001", title: "Cybersecurity Breach", description: "Risk of unauthorized access to sensitive data", likelihood: "High", impact: "High", inherent_risk: "High", category: "IT Security", status: "Active" },
          { id: "RISK002", title: "Regulatory Non-Compliance", description: "Failure to meet regulatory requirements", likelihood: "Medium", impact: "High", inherent_risk: "Medium", category: "Compliance", status: "Active" },
          { id: "RISK003", title: "Operational Disruption", description: "System downtime affecting business operations", likelihood: "Medium", impact: "Medium", inherent_risk: "Medium", category: "Operations", status: "Active" },
          { id: "RISK004", title: "Vendor Dependency", description: "Over-reliance on third-party vendors", likelihood: "Low", impact: "High", inherent_risk: "Medium", category: "Vendor Management", status: "Active" },
          { id: "RISK005", title: "Data Loss", description: "Accidental or intentional data loss", likelihood: "Low", impact: "High", inherent_risk: "Medium", category: "Data Protection", status: "Active" },
          { id: "RISK006", title: "Financial Misstatement", description: "Errors in financial reporting", likelihood: "Medium", impact: "High", inherent_risk: "High", category: "Financial", status: "Active" },
          { id: "RISK007", title: "Technology Obsolescence", description: "Outdated technology infrastructure", likelihood: "High", impact: "Medium", inherent_risk: "Medium", category: "Technology", status: "Active" }
        ]
        setAvailableRisks(mockRisks)
      } catch (error) {
        console.error("Error fetching risks:", error)
      } finally {
        setIsLoadingRisks(false)
      }
    }

    const fetchControls = async () => {
      setIsLoadingControls(true)
      try {
        // Mock controls - in real implementation, you'd have an API endpoint
        const mockControls: Control[] = [
          { id: "CTRL001", name: "Access Control System", description: "Automated user access management", type: "Preventive", effectiveness: "Effective", last_assessed: "2025-06-01" },
          { id: "CTRL002", name: "Data Encryption", description: "End-to-end data encryption", type: "Preventive", effectiveness: "Effective", last_assessed: "2025-06-05" },
          { id: "CTRL003", name: "Regular Backups", description: "Automated backup procedures", type: "Detective", effectiveness: "Effective", last_assessed: "2025-06-10" },
          { id: "CTRL004", name: "Vendor Assessment", description: "Regular vendor risk assessments", type: "Preventive", effectiveness: "Needs Improvement", last_assessed: "2025-05-15" },
          { id: "CTRL005", name: "Financial Reconciliation", description: "Monthly financial reconciliation process", type: "Detective", effectiveness: "Effective", last_assessed: "2025-06-01" }
        ]
        setAvailableControls(mockControls)
      } catch (error) {
        console.error("Error fetching controls:", error)
      } finally {
        setIsLoadingControls(false)
      }
    }

    fetchAuditPlans()
    fetchTeamMembers()
    fetchRisks()
    fetchControls()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof NewAssignmentFormState) => (value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveAssignment = async (e: FormEvent) => {
    e.preventDefault()
    if (!formState.parentAuditPlanId) {
      toast({
        title: "Missing Information",
        description: "Please select a Parent Audit Plan.",
        variant: "destructive",
      })
      return
    }

    try {
      const assignmentData = {
        title: formState.title,
        description: formState.description || '',
        status: "Draft",
        audit_plan_id: formState.parentAuditPlanId,
        start_date: formState.startDate || null,
        end_date: formState.endDate || null,
        risk_likelihood: formState.riskLikelihood,
        impact: formState.impact,
        inherent_risk: formState.inherentRisk,
        tasks: formState.tasks.map(task => ({
          description: task.description,
          assigneeId: task.assigneeId,
          dueDate: task.dueDate,
          status: task.status
        })),
        risks: formState.linkedRisks
          .filter(risk => !risk.id.startsWith('RISK') && !isNaN(parseInt(risk.id)))
          .map(risk => ({
            riskId: risk.id,
            controlId: formState.linkedControls.find(control => 
              !control.id.startsWith('CONTROL') && !isNaN(parseInt(control.id))
            )?.id,
            assessment: 'Effective'
          }))
          .filter(risk => risk.riskId && risk.controlId) // Only include if both IDs are valid
      }

      console.log('Sending assignment data:', assignmentData)

      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to save assignment: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Assignment saved successfully:", result)

      toast({
        title: "Assignment Created",
        description: `Assignment "${formState.title}" has been created successfully.`,
      })

      if (result.assignment?.id) {
        router.push(`/assignments/${result.assignment.id}`)
      } else {
        router.push("/assignments")
      }

    } catch (error) {
      console.error("Error saving assignment:", error)
      toast({
        title: "Error Creating Assignment",
        description: error instanceof Error ? error.message : "Failed to create assignment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    router.back()
  }

  // Team Management
  const handleManageTeam = () => { 
    setSelectedTeamMemberIds(new Set(formState.assignedTeamMembers.map((m) => m.id)))
    setIsTeamDialogOpen(true)
  }
  const handleTeamMemberToggle = (memberId: string) => { 
    setSelectedTeamMemberIds((prev) => { 
      const newSet = new Set(prev)
      if (newSet.has(memberId)) newSet.delete(memberId)
      else newSet.add(memberId)
      return newSet
    })
  }
  const handleConfirmTeamSelection = () => { 
    const selectedMembers = availableTeamMembers.filter((m) => selectedTeamMemberIds.has(m.id))
    setFormState((prev) => ({ ...prev, assignedTeamMembers: selectedMembers }))
    setIsTeamDialogOpen(false)
  }
  const removeTeamMember = (memberId: string) => { 
    setFormState((prev) => ({ 
      ...prev, 
      assignedTeamMembers: prev.assignedTeamMembers.filter((m) => m.id !== memberId)
    }))
  }

  // Risk Management
  const handleManageRisks = () => { 
    setSelectedRiskIds(new Set(formState.linkedRisks.map((r) => r.id)))
    setIsRiskDialogOpen(true)
  }
  const handleRiskToggle = (riskId: string) => { 
    setSelectedRiskIds((prev) => { 
      const newSet = new Set(prev)
      if (newSet.has(riskId)) newSet.delete(riskId)
      else newSet.add(riskId)
      return newSet
    })
  }
  const handleConfirmRiskSelection = () => { 
    const selectedRisks = availableRisks.filter((r) => selectedRiskIds.has(r.id))
    setFormState((prev) => ({ ...prev, linkedRisks: selectedRisks }))
    setIsRiskDialogOpen(false)
  }
  const removeLinkedRisk = (riskId: string) => { 
    setFormState((prev) => ({ 
      ...prev, 
      linkedRisks: prev.linkedRisks.filter((r) => r.id !== riskId)
    }))
  }

  // Control Management
  const handleManageControls = () => { 
    setSelectedControlIds(new Set(formState.linkedControls.map((c) => c.id)))
    setIsControlDialogOpen(true)
  }
  const handleControlToggle = (controlId: string) => { 
    setSelectedControlIds((prev) => { 
      const newSet = new Set(prev)
      if (newSet.has(controlId)) newSet.delete(controlId)
      else newSet.add(controlId)
      return newSet
    })
  }
  const handleConfirmControlSelection = () => { 
    const selectedControls = availableControls.filter((c) => selectedControlIds.has(c.id))
    setFormState((prev) => ({ ...prev, linkedControls: selectedControls }))
    setIsControlDialogOpen(false)
  }
  const removeLinkedControl = (controlId: string) => { 
    setFormState((prev) => ({ 
      ...prev, 
      linkedControls: prev.linkedControls.filter((c) => c.id !== controlId)
    }))
  }

  // Task Management
  const handleAddTask = () => {
    if (!newTask.description?.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a task description.",
        variant: "destructive",
      })
      return
    }

    const task: Task = {
      id: `TASK_${Date.now()}`,
      description: newTask.description,
      assigneeId: newTask.assigneeId === "unassigned" ? undefined : newTask.assigneeId,
      dueDate: newTask.dueDate || undefined,
      priority: newTask.priority || "Medium",
      status: newTask.status || "Pending"
    }

    setFormState(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }))

    // Reset form
    setNewTask({
      description: "",
      assigneeId: "unassigned",
      dueDate: "",
      priority: "Medium",
      status: "Pending"
    })

    setIsTaskDialogOpen(false)
    toast({
      title: "Task Added",
      description: "New task has been added to the assignment.",
    })
  }

  const removeTask = (taskId: string) => {
    setFormState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-800 border-red-200"
      case "Critical": return "bg-red-100 text-red-800 border-red-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200"
      case "High": return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const auditPlanComboboxOptions = availableAuditPlans.map((plan) => ({
    value: plan.id,
    label: plan.title,
  }))

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <form onSubmit={handleSaveAssignment}>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <Input
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              placeholder="Enter assignment name..."
              className="text-3xl font-semibold h-auto p-2"
              required
            />
            <Textarea
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              placeholder="Enter assignment description..."
              className="min-h-[80px]"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button type="submit" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Save Assignment
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Tasks Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Tasks
                  </CardTitle>
                  <CardDescription>Manage tasks related to this assignment.</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </CardHeader>
              <CardContent>
                {formState.tasks.length > 0 ? (
                  <div className="space-y-3">
                    {formState.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{task.description}</p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span>Assigned to: {task.assigneeId ? availableTeamMembers.find(u => u.id === task.assigneeId)?.name || "Unknown" : "Unassigned"}</span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {task.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">{task.status}</Badge>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeTask(task.id)}
                            title="Remove Task"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tasks added yet. Click "Add Task" to get started.</p>
                )}
              </CardContent>
            </Card>

            {/* Related Risks & Controls Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Related Risks & Controls
                </CardTitle>
                <CardDescription>Link existing risks and controls from the governance model.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risks Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Linked Risks</h4>
                    <Button type="button" variant="outline" size="sm" onClick={handleManageRisks}>
                      <LinkIcon className="mr-2 h-4 w-4" /> Manage Risks
                    </Button>
                  </div>
                  {formState.linkedRisks.length > 0 ? (
                    <div className="space-y-2">
                      {formState.linkedRisks.map((risk) => (
                        <div key={risk.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{risk.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRiskColor(risk.likelihood)} variant="outline">
                                Likelihood: {risk.likelihood}
                              </Badge>
                              <Badge className={getRiskColor(risk.impact)} variant="outline">
                                Impact: {risk.impact}
                              </Badge>
                              <Badge className={getRiskColor(risk.inherent_risk)} variant="outline">
                                Inherent: {risk.inherent_risk}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeLinkedRisk(risk.id)}
                            title="Unlink Risk"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No risks linked yet.</p>
                  )}
                </div>

                {/* Controls Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Linked Controls</h4>
                    <Button type="button" variant="outline" size="sm" onClick={handleManageControls}>
                      <LinkIcon className="mr-2 h-4 w-4" /> Manage Controls
                    </Button>
                  </div>
                  {formState.linkedControls.length > 0 ? (
                    <div className="space-y-2">
                      {formState.linkedControls.map((control) => (
                        <div key={control.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{control.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{control.type}</Badge>
                              <Badge variant="outline">{control.effectiveness}</Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeLinkedControl(control.id)}
                            title="Unlink Control"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No controls linked yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Requirement Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Requirement Details</CardTitle>
                <CardDescription>Specify the core requirement for this assignment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Parent Audit Plan Dropdown */}
                <div>
                  <Label htmlFor="parentAuditPlanId">
                    Parent Audit Plan <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={auditPlanComboboxOptions}
                    value={formState.parentAuditPlanId}
                    onChange={handleSelectChange("parentAuditPlanId")}
                    placeholder={isLoadingAuditPlans ? "Loading plans..." : "Select a parent audit plan"}
                    searchPlaceholder="Search audit plans..."
                    emptyMessage={
                      isLoadingAuditPlans
                        ? "Loading..."
                        : auditPlansError
                          ? `Error: ${auditPlansError}`
                          : availableAuditPlans.length === 0 
                            ? "No audit plans found."
                            : "No matching audit plans."
                    }
                    disabled={isLoadingAuditPlans}
                  />
                  {auditPlansError && !isLoadingAuditPlans && (
                    <p className="text-sm text-red-500 mt-1">{auditPlansError}</p>
                  )}
                </div>

                {/* Other fields */}
                <div>
                  <Label htmlFor="requirementType">Type</Label>
                  <Select 
                    name="requirementType" 
                    value={formState.requirementType} 
                    onValueChange={handleSelectChange("requirementType")}
                  >
                    <SelectTrigger id="requirementType">
                      <SelectValue placeholder="Select requirement type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRequirementTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="riskLikelihood">Risk Likelihood</Label>
                  <Select 
                    name="riskLikelihood" 
                    value={formState.riskLikelihood} 
                    onValueChange={handleSelectChange("riskLikelihood")}
                  >
                    <SelectTrigger id="riskLikelihood">
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskRatingOptions.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="impact">Impact</Label>
                  <Select 
                    name="impact" 
                    value={formState.impact} 
                    onValueChange={handleSelectChange("impact")}
                  >
                    <SelectTrigger id="impact">
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskRatingOptions.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="inherentRisk">Inherent Risk</Label>
                  <Select 
                    name="inherentRisk" 
                    value={formState.inherentRisk} 
                    onValueChange={handleSelectChange("inherentRisk")}
                  >
                    <SelectTrigger id="inherentRisk">
                      <SelectValue placeholder="Select inherent risk" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskRatingOptions.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formState.startDate || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formState.endDate || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Team Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Assigned Team
                  </CardTitle>
                  <CardDescription>Select team members for this assignment.</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleManageTeam}>
                  <Users className="mr-2 h-4 w-4" /> Manage Team
                </Button>
              </CardHeader>
              <CardContent>
                {formState.assignedTeamMembers.length > 0 ? (
                  <div className="space-y-2">
                    {formState.assignedTeamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{member.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeTeamMember(member.id)}
                          title="Remove Member"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No team members assigned yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Team Management Dialog */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Team Members</DialogTitle>
            <DialogDescription>Select team members to assign to this assignment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {availableTeamMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                <Checkbox 
                  id={`team-${member.id}`} 
                  checked={selectedTeamMemberIds.has(member.id)} 
                  onCheckedChange={() => handleTeamMemberToggle(member.id)} 
                />
                <Label htmlFor={`team-${member.id}`} className="flex items-center gap-2 cursor-pointer flex-grow">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {member.name}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmTeamSelection}>Confirm Selection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Risk Management Dialog */}
      <Dialog open={isRiskDialogOpen} onOpenChange={setIsRiskDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Linked Risks</DialogTitle>
            <DialogDescription>Select risks from the governance model to link to this assignment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {availableRisks.map((risk) => (
              <div key={risk.id} className="flex items-center space-x-2 p-3 hover:bg-muted/50 rounded-md border">
                <Checkbox 
                  id={`risk-${risk.id}`} 
                  checked={selectedRiskIds.has(risk.id)} 
                  onCheckedChange={() => handleRiskToggle(risk.id)} 
                />
                <Label htmlFor={`risk-${risk.id}`} className="cursor-pointer flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{risk.title}</p>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(risk.likelihood)} variant="outline">
                        {risk.likelihood}
                      </Badge>
                      <Badge className={getRiskColor(risk.impact)} variant="outline">
                        {risk.impact}
                      </Badge>
                      <Badge className={getRiskColor(risk.inherent_risk)} variant="outline">
                        {risk.inherent_risk}
                      </Badge>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmRiskSelection}>Confirm Selection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Control Management Dialog */}
      <Dialog open={isControlDialogOpen} onOpenChange={setIsControlDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Linked Controls</DialogTitle>
            <DialogDescription>Select controls from the governance model to link to this assignment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {availableControls.map((control) => (
              <div key={control.id} className="flex items-center space-x-2 p-3 hover:bg-muted/50 rounded-md border">
                <Checkbox 
                  id={`control-${control.id}`} 
                  checked={selectedControlIds.has(control.id)} 
                  onCheckedChange={() => handleControlToggle(control.id)} 
                />
                <Label htmlFor={`control-${control.id}`} className="cursor-pointer flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{control.name}</p>
                      <p className="text-sm text-muted-foreground">{control.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{control.type}</Badge>
                      <Badge variant="outline">{control.effectiveness}</Badge>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmControlSelection}>Confirm Selection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Creation Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a new task for this assignment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="taskDescription">Task Description *</Label>
              <Textarea
                id="taskDescription"
                value={newTask.description || ""}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter task description..."
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taskAssignee">Assignee</Label>
                <Select 
                  value={newTask.assigneeId || ""} 
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, assigneeId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {availableTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="taskDueDate">Due Date</Label>
                <Input
                  type="date"
                  id="taskDueDate"
                  value={newTask.dueDate || ""}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taskPriority">Priority</Label>
                <Select 
                  value={newTask.priority || "Medium"} 
                  onValueChange={(value: Task["priority"]) => setNewTask(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="taskStatus">Status</Label>
                <Select 
                  value={newTask.status || "Pending"} 
                  onValueChange={(value: Task["status"]) => setNewTask(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
