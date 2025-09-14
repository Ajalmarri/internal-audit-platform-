"use client"
import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Save,
  Send,
  PlusCircle,
  Trash2,
  FileText,
  Users,
} from "lucide-react"

// Types
interface ActionPlanItem {
  id: string
  action: string
  responsiblePerson: string
  dueDate: Date | undefined
  status: "To Do" | "In Progress" | "Completed" | "Blocked"
  description?: string
}

interface ActionPlanFormData {
  findingId: string
  findingTitle: string
  businessOwner: string
  items: ActionPlanItem[]
  status: "Accepted" | "Not Accepted"
  priority: "Low" | "Medium" | "High" | "Critical"
}

interface FindingFromAPI {
  id: string
  title: string
  description?: string
  status?: string
  severity?: string
  assignment_id?: string
  engagement_id?: string
  created_at?: string
  updated_at?: string
  business_unit?: string
  business_owner_id?: string
}

interface BusinessOwnerFromAPI {
  id: string
  name: string
}

interface AssignmentFromAPI {
  id: string
  title: string
  description?: string
  status?: string
  audit_plan_id?: string
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
}

// Mock data for other dropdowns (keeping these as they don't have API endpoints yet)

const mockPersonnel = [
  "Cloud Security Team",
  "DevOps Team",
  "Finance Systems Admin",
  "Finance Controller",
  "SysAdmin Team",
  "Monitoring Team",
  "Identity Management Team",
  "Security Operations",
  "Backup Team Lead",
  "Disaster Recovery Team",
]


const initialFormData: ActionPlanFormData = {
  findingId: "",
  findingTitle: "",
  businessOwner: "",
  items: [
    {
      id: `item-${Date.now()}`,
      action: "",
      responsiblePerson: "",
      dueDate: undefined,
      status: "To Do",
      description: "",
    },
  ],
  status: "Accepted",
  priority: "Medium",
}

export default function CreateActionPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const findingIdParam = searchParams.get("findingId")

  const [formData, setFormData] = useState<ActionPlanFormData>(() => {
    return initialFormData
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [findings, setFindings] = useState<FindingFromAPI[]>([])
  const [isLoadingFindings, setIsLoadingFindings] = useState(true)
  const [findingsError, setFindingsError] = useState<string | null>(null)
  const [businessOwners, setBusinessOwners] = useState<BusinessOwnerFromAPI[]>([])
  const [isLoadingBusinessOwners, setIsLoadingBusinessOwners] = useState(true)
  const [businessOwnersError, setBusinessOwnersError] = useState<string | null>(null)
  const [businessUnitMismatchError, setBusinessUnitMismatchError] = useState<string | null>(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("all")
  const [filteredFindings, setFilteredFindings] = useState<FindingFromAPI[]>([])
  const [assignments, setAssignments] = useState<AssignmentFromAPI[]>([])
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true)
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null)

  // Fetch findings from API
  useEffect(() => {
    const fetchFindings = async () => {
      try {
        setIsLoadingFindings(true)
        setFindingsError(null)
        const response = await fetch('/api/findings')
        if (!response.ok) {
          throw new Error('Failed to fetch findings')
        }
        const data = await response.json()
        setFindings(data)
      } catch (error) {
        console.error('Error fetching findings:', error)
        setFindingsError(error instanceof Error ? error.message : 'Failed to fetch findings')
      } finally {
        setIsLoadingFindings(false)
      }
    }

    fetchFindings()
  }, [])

  // Fetch business owners from API
  useEffect(() => {
    const fetchBusinessOwners = async () => {
      try {
        setIsLoadingBusinessOwners(true)
        setBusinessOwnersError(null)
        const response = await fetch('/api/primary-stakeholders')
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`Failed to fetch business owners: ${response.status} ${response.statusText}${errorData.message ? ` - ${errorData.message}` : ''}`)
        }
        const data = await response.json()
        setBusinessOwners(data)
      } catch (error) {
        console.error('Error fetching business owners:', error)
        setBusinessOwnersError(error instanceof Error ? error.message : 'Failed to fetch business owners')
      } finally {
        setIsLoadingBusinessOwners(false)
      }
    }

    fetchBusinessOwners()
  }, [])

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoadingAssignments(true)
      setAssignmentsError(null)
      try {
        const response = await fetch('/api/assignments')
        if (!response.ok) {
          throw new Error('Failed to fetch assignments')
        }
        const data = await response.json()
        setAssignments(data)
      } catch (error) {
        console.error('Error fetching assignments:', error)
        setAssignmentsError(error instanceof Error ? error.message : 'Failed to fetch assignments')
      } finally {
        setIsLoadingAssignments(false)
      }
    }

    fetchAssignments()
  }, [])

  // Set initial finding if findingIdParam is provided
  useEffect(() => {
    if (findingIdParam && findings.length > 0) {
      const finding = findings.find((f) => f.id === findingIdParam)
      if (finding) {
        setFormData((prev) => ({
          ...prev,
          findingId: findingIdParam,
          findingTitle: finding.title,
        }))
      }
    }
  }, [findingIdParam, findings])

  // Validate business unit compatibility whenever form data changes
  useEffect(() => {
    if (formData.findingId && formData.businessOwner) {
      const selectedFinding = filteredFindings.find(f => f.id === formData.findingId)
      const selectedBusinessOwner = businessOwners.find(bo => bo.name === formData.businessOwner)
      
      if (selectedFinding && selectedBusinessOwner) {
        if (selectedFinding.business_unit && selectedFinding.business_unit !== selectedBusinessOwner.name) {
          setBusinessUnitMismatchError(
            `The selected finding belongs to "${selectedFinding.business_unit}" but you selected "${selectedBusinessOwner.name}" as the business owner. Please select a business owner from the same business unit or choose a different finding.`
          )
        } else {
          // Clear error if they match
          setBusinessUnitMismatchError(null)
        }
      }
    } else {
      // Clear error if either field is empty
      setBusinessUnitMismatchError(null)
    }
  }, [formData.findingId, formData.businessOwner, filteredFindings, businessOwners])

  // Filter findings based on selected assignment
  useEffect(() => {
    if (selectedAssignmentId && selectedAssignmentId !== "all") {
      const filtered = findings.filter(finding => finding.assignment_id === selectedAssignmentId)
      setFilteredFindings(filtered)
    } else {
      setFilteredFindings(findings)
    }
  }, [selectedAssignmentId, findings])

  const handleInputChange = (field: keyof ActionPlanFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAssignmentChange = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId)
    // Clear selected finding when assignment changes
    setFormData((prev) => ({
      ...prev,
      findingId: "",
      findingTitle: "",
    }))
  }

  const handleFindingChange = (findingId: string) => {
    const finding = filteredFindings.find((f) => f.id === findingId)
    setFormData((prev) => ({
      ...prev,
      findingId,
      findingTitle: finding?.title || "",
    }))
  }

  const handleItemChange = (index: number, field: keyof ActionPlanItem, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const addActionItem = () => {
    const newItem: ActionPlanItem = {
      id: `item-${Date.now()}`,
      action: "",
      responsiblePerson: "",
      dueDate: undefined,
      status: "To Do",
      description: "",
    }
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeActionItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }))
    }
  }


  const validateForm = (): boolean => {
    if (!formData.findingId) {
      toast({
        title: "Validation Error",
        description: "Please select a finding for this action plan.",
        variant: "destructive",
      })
      return false
    }

    if (!formData.businessOwner) {
      toast({
        title: "Validation Error",
        description: "Please select a business owner.",
        variant: "destructive",
      })
      return false
    }


    const incompleteItems = formData.items.filter(
      (item) => !item.action.trim() || !item.responsiblePerson || !item.dueDate,
    )

    if (incompleteItems.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please complete all action items (action, responsible person, and due date are required).",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (action: "draft" | "submit") => {
    if (!validateForm()) return

    // Check for business unit mismatch
    if (businessUnitMismatchError) {
      toast({
        title: "Business Unit Mismatch",
        description: businessUnitMismatchError,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const actionPlanData = {
        ...formData,
        status: action === "draft" ? "Draft" : "Submitted",
      }

      console.log("Action Plan Data:", actionPlanData)

      // Call the API to create the action plan
      const response = await fetch('/api/action-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actionPlanData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Action plan created successfully:", result)

      toast({
        title: `Action Plan ${action === "draft" ? "Saved as Draft" : "Submitted"}`,
        description: `Action plan for "${formData.findingTitle}" has been ${action === "draft" ? "saved" : "submitted"}.`,
      })

      // Navigate back to action plans list
      router.push("/action-plans")
    } catch (error) {
      console.error("Error creating action plan:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save action plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/action-plans">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Action Plans
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold text-foreground">Create New Action Plan</h1>
        <p className="text-muted-foreground">
          Develop a comprehensive plan to address audit findings with specific actions and timelines.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>Link this action plan to a specific finding and assign ownership.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="assignment">Assignment</Label>
                <Select 
                  value={selectedAssignmentId} 
                  onValueChange={handleAssignmentChange}
                  disabled={isLoadingAssignments}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingAssignments 
                        ? "Loading assignments..." 
                        : assignmentsError 
                          ? "Error loading assignments" 
                          : "Select assignment to filter findings..."
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignments</SelectItem>
                    {assignmentsError ? (
                      <div className="px-2 py-1.5 text-sm text-red-500">
                        Error: {assignmentsError}
                      </div>
                    ) : assignments.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No assignments available
                      </div>
                    ) : (
                      assignments.map((assignment) => (
                        <SelectItem key={assignment.id} value={assignment.id}>
                          {assignment.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {assignmentsError && (
                  <p className="text-xs text-red-500 mt-1">Failed to load assignments. Please refresh the page.</p>
                )}
              </div>
              <div>
                <Label htmlFor="finding">Related Finding *</Label>
                <Select 
                  value={formData.findingId} 
                  onValueChange={handleFindingChange} 
                  disabled={!!findingIdParam || isLoadingFindings}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingFindings 
                        ? "Loading findings..." 
                        : findingsError 
                          ? "Error loading findings" 
                          : selectedAssignmentId && selectedAssignmentId !== "all"
                            ? "Select a finding from this assignment..."
                            : "Select a finding..."
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {findingsError ? (
                      <div className="px-2 py-1.5 text-sm text-red-500">
                        Error: {findingsError}
                      </div>
                    ) : filteredFindings.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {selectedAssignmentId && selectedAssignmentId !== "all" ? "No findings found for this assignment" : "No findings available"}
                      </div>
                    ) : (
                      filteredFindings.map((finding) => (
                        <SelectItem key={finding.id} value={finding.id}>
                          {finding.id} - {finding.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {findingIdParam && (
                  <p className="text-xs text-muted-foreground mt-1">Pre-selected from finding context</p>
                )}
                {findingsError && (
                  <p className="text-xs text-red-500 mt-1">Failed to load findings. Please refresh the page.</p>
                )}
                {selectedAssignmentId && selectedAssignmentId !== "all" && (
                  <p className="text-xs text-blue-600 mt-1">
                    Showing findings from: {assignments.find(a => a.id === selectedAssignmentId)?.title}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="businessOwner">Business Owner *</Label>
                <Select
                  value={formData.businessOwner}
                  onValueChange={(value) => handleInputChange("businessOwner", value)}
                  disabled={isLoadingBusinessOwners}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingBusinessOwners 
                        ? "Loading business owners..." 
                        : businessOwnersError 
                          ? "Error loading business owners" 
                          : "Select business owner..."
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {businessOwnersError ? (
                      <div className="px-2 py-1.5 text-sm text-red-500">
                        Error: {businessOwnersError}
                      </div>
                    ) : businessOwners.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No business owners available
                      </div>
                    ) : (
                      businessOwners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.name}>
                          {owner.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {businessOwnersError && (
                  <p className="text-xs text-red-500 mt-1">Failed to load business owners. Please refresh the page.</p>
                )}
                {businessUnitMismatchError && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-800">
                      <strong>⚠️ Business Unit Mismatch:</strong> {businessUnitMismatchError}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Not Accepted">Not Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Action Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Action Items
              </CardTitle>
              <CardDescription>
                Break down the action plan into specific, actionable tasks with clear ownership and deadlines.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addActionItem}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Action Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.items.map((item, index) => (
              <Card key={item.id} className="p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-semibold">Action Item #{index + 1}</h4>
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeActionItem(index)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`action-${item.id}`}>Action Description *</Label>
                    <Textarea
                      id={`action-${item.id}`}
                      value={item.action}
                      onChange={(e) => handleItemChange(index, "action", e.target.value)}
                      placeholder="Describe the specific action to be taken..."
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`description-${item.id}`}>Additional Details (Optional)</Label>
                    <Textarea
                      id={`description-${item.id}`}
                      value={item.description || ""}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      placeholder="Provide additional context, requirements, or specifications..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`responsible-${item.id}`}>Responsible Person *</Label>
                      <Select
                        value={item.responsiblePerson}
                        onValueChange={(value) => handleItemChange(index, "responsiblePerson", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select person/team..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPersonnel.map((person) => (
                            <SelectItem key={person} value={person}>
                              {person}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`dueDate-${item.id}`}>Due Date *</Label>
                      <DatePicker
                        date={item.dueDate}
                        setDate={(date) => handleItemChange(index, "dueDate", date)}
                        placeholder="Select due date"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`status-${item.id}`}>Initial Status</Label>
                      <Select value={item.status} onValueChange={(value) => handleItemChange(index, "status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Do">To Do</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => handleSubmit("draft")} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button type="button" onClick={() => handleSubmit("submit")} disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" />
            Submit Action Plan
          </Button>
        </div>
      </form>
    </div>
  )
}
