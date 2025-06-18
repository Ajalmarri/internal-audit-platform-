"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Save,
  Send,
  PlusCircle,
  Trash2,
  FileText,
  Target,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

// Types (same as create page)
interface ActionPlanItem {
  id: string
  action: string
  responsiblePerson: string
  dueDate: Date | undefined
  status: "To Do" | "In Progress" | "Completed" | "Blocked"
  description?: string
}

interface ActionPlanFormData {
  id: string
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
  status: "Draft" | "Submitted" | "In Progress" | "Completed" | "Overdue" | "At Risk"
  submittedDate?: string
  lastUpdated: string
}

// Mock data (same as create page)
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

// Mock existing action plan data
const mockActionPlan: ActionPlanFormData = {
  id: "AP001",
  findingId: "FND001",
  findingTitle: "Unsecured S3 Bucket Exposing Sensitive Data",
  businessOwner: "IT Security Manager",
  overallObjective: "Secure all S3 buckets and implement proper access controls to prevent unauthorized data exposure",
  items: [
    {
      id: "AP001-1",
      action: "Restrict public access to the S3 bucket",
      responsiblePerson: "Cloud Security Team",
      dueDate: new Date("2025-06-15"),
      status: "Completed",
      description: "Immediately remove public read permissions and configure proper bucket policies",
    },
    {
      id: "AP001-2",
      action: "Review and update S3 bucket ACLs and policies",
      responsiblePerson: "Cloud Security Team",
      dueDate: new Date("2025-06-20"),
      status: "In Progress",
      description: "Comprehensive review of all S3 buckets to ensure proper access controls",
    },
    {
      id: "AP001-3",
      action: "Implement automated checks for S3 bucket configurations",
      responsiblePerson: "DevOps Team",
      dueDate: new Date("2025-07-01"),
      status: "To Do",
      description: "Set up automated monitoring and alerting for S3 bucket misconfigurations",
    },
  ],
  targetCompletionDate: new Date("2025-07-01"),
  priority: "Critical",
  estimatedEffort: "3 weeks",
  successCriteria: "All S3 buckets secured with proper access controls and automated monitoring in place",
  riskMitigation: "Regular security audits and automated compliance checks",
  status: "In Progress",
  submittedDate: "2025-06-05T10:00:00Z",
  lastUpdated: "2025-06-10T14:30:00Z",
}

const statusConfig = {
  "To Do": { icon: Clock, color: "text-gray-500", bgColor: "bg-gray-100" },
  "In Progress": { icon: Clock, color: "text-blue-500", bgColor: "bg-blue-100" },
  Completed: { icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-100" },
  Blocked: { icon: XCircle, color: "text-red-500", bgColor: "bg-red-100" },
}

export default function EditActionPlanPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.planId as string

  const [formData, setFormData] = useState<ActionPlanFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Simulate loading existing action plan data
    const loadActionPlan = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (planId === "AP001") {
          setFormData(mockActionPlan)
        } else {
          throw new Error("Action plan not found")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load action plan. Please try again.",
          variant: "destructive",
        })
        router.push("/action-plans")
      } finally {
        setIsLoading(false)
      }
    }

    loadActionPlan()
  }, [planId, router])

  const handleInputChange = (field: keyof ActionPlanFormData, value: any) => {
    if (!formData) return
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleItemChange = (index: number, field: keyof ActionPlanItem, value: any) => {
    if (!formData) return
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData((prev) => (prev ? { ...prev, items: newItems } : null))
  }

  const addActionItem = () => {
    if (!formData) return
    const newItem: ActionPlanItem = {
      id: `item-${Date.now()}`,
      action: "",
      responsiblePerson: "",
      dueDate: undefined,
      status: "To Do",
      description: "",
    }
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            items: [...prev.items, newItem],
          }
        : null,
    )
  }

  const removeActionItem = (index: number) => {
    if (!formData || formData.items.length <= 1) return
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
          }
        : null,
    )
  }

  const validateForm = (): boolean => {
    if (!formData) return false

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

  const handleSubmit = async (action: "save" | "submit") => {
    if (!formData || !validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedActionPlan = {
        ...formData,
        lastUpdated: new Date().toISOString(),
        ...(action === "submit" &&
          formData.status === "Draft" && {
            status: "Submitted",
            submittedDate: new Date().toISOString(),
          }),
      }

      console.log("Updated Action Plan Data:", updatedActionPlan)

      toast({
        title: `Action Plan ${action === "save" ? "Updated" : "Submitted"}`,
        description: `Changes to "${formData.findingTitle}" have been saved.`,
      })

      // Navigate back to action plans list or detail view
      router.push("/action-plans")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update action plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateProgress = () => {
    if (!formData) return 0
    const completedItems = formData.items.filter((item) => item.status === "Completed").length
    return Math.round((completedItems / formData.items.length) * 100)
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Action Plan Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested action plan could not be loaded.</p>
          <Button asChild className="mt-4">
            <Link href="/action-plans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Action Plans
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/action-plans">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Action Plans
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Edit Action Plan</h1>
            <p className="text-muted-foreground">Update the action plan for "{formData.findingTitle}"</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              Progress: {calculateProgress()}%
            </Badge>
            <Badge
              variant={formData.status === "Completed" ? "default" : "secondary"}
              className={formData.status === "Completed" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
            >
              {formData.status}
            </Badge>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Related Finding</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-medium">
                    {formData.findingId} - {formData.findingTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">Finding cannot be changed after creation</p>
                </div>
              </div>
              <div>
                <Label htmlFor="businessOwner">Business Owner</Label>
                <Select
                  value={formData.businessOwner}
                  onValueChange={(value) => handleInputChange("businessOwner", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                />
              </div>
              <div>
                <Label htmlFor="riskMitigation">Risk Mitigation</Label>
                <Textarea
                  id="riskMitigation"
                  value={formData.riskMitigation}
                  onChange={(e) => handleInputChange("riskMitigation", e.target.value)}
                  rows={3}
                />
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
              <CardDescription>Update action items and track their progress.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addActionItem}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Action Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.items.map((item, index) => {
              const statusInfo = statusConfig[item.status]
              return (
                <Card key={item.id} className="p-4 bg-muted/30">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">Action Item #{index + 1}</h4>
                      <Badge variant="outline" className={`${statusInfo.bgColor} ${statusInfo.color} border-current`}>
                        <statusInfo.icon className="mr-1 h-3 w-3" />
                        {item.status}
                      </Badge>
                    </div>
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
                        rows={2}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-${item.id}`}>Additional Details</Label>
                      <Textarea
                        id={`description-${item.id}`}
                        value={item.description || ""}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`responsible-${item.id}`}>Responsible Person *</Label>
                        <Select
                          value={item.responsiblePerson}
                          onValueChange={(value) => handleItemChange(index, "responsiblePerson", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                        <Label htmlFor={`status-${item.id}`}>Status</Label>
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
              )
            })}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => handleSubmit("save")} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
          {formData.status === "Draft" && (
            <Button type="button" onClick={() => handleSubmit("submit")} disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              Submit Action Plan
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
