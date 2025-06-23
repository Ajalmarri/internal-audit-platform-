"use client"
import { useState } from "react"
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
import { ArrowLeft, FileText, Target, Briefcase } from "lucide-react"

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
  overallObjective: string
  items: ActionPlanItem[]
  targetCompletionDate: Date | undefined
  priority: "Low" | "Medium" | "High" | "Critical"
  estimatedEffort: string
  successCriteria: string
  riskMitigation: string
  requiredPersonnel: string
  estimatedBudget: string
  necessaryTools: string
}

// Mock data for dropdowns
const mockFindings = [
  { id: "FND001", title: "Unsecured S3 Bucket Exposing Sensitive Data" },
  { id: "FND002", title: "Lack of Segregation of Duties in Financial Reporting" },
  { id: "FND003", title: "Outdated Anti-Virus Signatures on Critical Servers" },
  { id: "FND004", title: "Inadequate Password Policy for Admin Accounts" },
  { id: "FND005", title: "Missing Backup Verification Procedures" },
]

const mockBusinessOwners = [
  "IT Security Manager",
  "Finance Department Head",
  "IT Operations Lead",
  "Data Management Lead",
  "Compliance Officer",
  "HR Director",
  "Operations Manager",
]

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
  overallObjective: "",
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
  targetCompletionDate: undefined,
  priority: "Medium",
  estimatedEffort: "",
  successCriteria: "",
  riskMitigation: "",
  requiredPersonnel: "",
  estimatedBudget: "",
  necessaryTools: "",
}

export default function CreateActionPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const findingIdParam = searchParams.get("findingId")

  const [formData, setFormData] = useState<ActionPlanFormData>(() => {
    if (findingIdParam) {
      const finding = mockFindings.find((f) => f.id === findingIdParam)
      return {
        ...initialFormData,
        findingId: findingIdParam,
        findingTitle: finding?.title || "",
      }
    }
    return initialFormData
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ActionPlanFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFindingChange = (findingId: string) => {
    const finding = mockFindings.find((f) => f.id === findingId)
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

    if (!formData.overallObjective.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide an overall objective for the action plan.",
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

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const actionPlanData = {
        ...formData,
        status: action === "draft" ? "Draft" : "Submitted",
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }

      console.log("Action Plan Data:", actionPlanData)

      toast({
        title: `Action Plan ${action === "draft" ? "Saved as Draft" : "Submitted"}`,
        description: `Action plan for "${formData.findingTitle}" has been ${action === "draft" ? "saved" : "submitted"}.`,
      })

      // Navigate back to action plans list
      router.push("/action-plans")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save action plan. Please try again.",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="finding">Related Finding *</Label>
                <Select value={formData.findingId} onValueChange={handleFindingChange} disabled={!!findingIdParam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a finding..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFindings.map((finding) => (
                      <SelectItem key={finding.id} value={finding.id}>
                        {finding.id} - {finding.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {findingIdParam && (
                  <p className="text-xs text-muted-foreground mt-1">Pre-selected from finding context</p>
                )}
              </div>
              <div>
                <Label htmlFor="businessOwner">Business Owner *</Label>
                <Select
                  value={formData.businessOwner}
                  onValueChange={(value) => handleInputChange("businessOwner", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business owner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBusinessOwners.map((owner) => (
                      <SelectItem key={owner} value={owner}>
                        {owner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="targetCompletionDate">Target Completion Date</Label>
                <DatePicker
                  date={formData.targetCompletionDate}
                  setDate={(date) => handleInputChange("targetCompletionDate", date)}
                  placeholder="Select target date"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectives and Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="mr-2 h-5 w-5 text-primary" />
              Objectives & Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="overallObjective">Overall Objective *</Label>
              <Textarea
                id="overallObjective"
                value={formData.overallObjective}
                onChange={(e) => handleInputChange("overallObjective", e.target.value)}
                placeholder="Describe the main goal and expected outcome of this action plan..."
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="successCriteria">Success Criteria</Label>
              <Textarea
                id="successCriteria"
                value={formData.successCriteria}
                onChange={(e) => handleInputChange("successCriteria", e.target.value)}
                placeholder="Define how success will be measured and what constitutes completion..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="estimatedEffort">Estimated Effort</Label>
                <Input
                  id="estimatedEffort"
                  value={formData.estimatedEffort}
                  onChange={(e) => handleInputChange("estimatedEffort", e.target.value)}
                  placeholder="e.g., 40 hours, 2 weeks, 3 person-months"
                />
              </div>
              <div>
                <Label htmlFor="riskMitigation">Risk Mitigation</Label>
                <Textarea
                  id="riskMitigation"
                  value={formData.riskMitigation}
                  onChange={(e) => handleInputChange("riskMitigation", e.target.value)}
                  placeholder="Identify potential risks and mitigation strategies..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource & Budget Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Resource & Budget Allocation
            </CardTitle>
            <CardDescription>Detail the personnel, budget, and tools required for this action plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="requiredPersonnel">Required Personnel/Skills</Label>
              <Textarea
                id="requiredPersonnel"
                value={formData.requiredPersonnel}
                onChange={(e) => handleInputChange("requiredPersonnel", e.target.value)}
                placeholder="e.g., 1 Senior Developer, 1 Database Administrator, external consultant..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                <div className="relative">
                  <Input
                    id="estimatedBudget"
                    type="text"
                    value={formData.estimatedBudget}
                    onChange={(e) => handleInputChange("estimatedBudget", e.target.value)}
                    placeholder="15,000"
                    className="pl-14"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground font-semibold">AED</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="necessaryTools">Necessary Tools/Software</Label>
              <Textarea
                id="necessaryTools"
                value={formData.necessaryTools}
                onChange={(e) => handleInputChange("necessaryTools", e.target.value)}
                placeholder="List any required software licenses, cloud services, or physical tools needed to complete the action plan."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">\
            <div>
