"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Save,
  Send,
  Info,
  ShieldCheck,
  ClipboardCheck,
  Hourglass,
  Lock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CalendarPlus,
  PlusCircle,
  Trash2,
  ListChecks,
} from "lucide-react"
import type { Finding, FindingStatus, ActionPlan, ActionPlanItem } from "../../_types/finding-types"
import { mockFindings } from "../../_types/finding-types"
import { DatePicker } from "@/components/ui/date-picker"

// Mock current user (replace with actual auth context)
const currentAuditor = { name: "Current Auditor User", role: "Auditor" }
const currentBusinessOwner = { name: "Current Business Owner", role: "BusinessOwner" }
// Simulate current user role for UI logic
const currentUserRole = "Auditor" // Change to "BusinessOwner" to test BO view

export default function EditFindingPage() {
  const router = useRouter()
  const params = useParams()
  const findingId = params.findingId as string

  const [finding, setFinding] = useState<Finding | null>(null)
  const [formData, setFormData] = useState<Partial<Finding>>({})
  const [isLoading, setIsLoading] = useState(true)

  // State for Business Owner Action Plan Creation
  const [isFindingAcceptedByBOState, setIsFindingAcceptedByBOState] = useState(false)
  const [managementCommentsState, setManagementCommentsState] = useState("")
  const [actionPlanObjectiveState, setActionPlanObjectiveState] = useState("")
  const [actionPlanItemsState, setActionPlanItemsState] = useState<ActionPlanItem[]>([])

  // State for Auditor Review of Action Plan
  const [auditorCommentsOnPlanState, setAuditorCommentsOnPlanState] = useState("")
  const [newDueDateForExtension, setNewDueDateForExtension] = useState<Date | undefined>()

  // State for Remediation Evidence
  const [remediationEvidenceDescription, setRemediationEvidenceDescription] = useState("")
  const [remediationFile, setRemediationFile] = useState<File | null>(null)
  const [targetActionItemIdForEvidence, setTargetActionItemIdForEvidence] = useState<string | undefined>()

  useEffect(() => {
    const fetchedFinding = mockFindings.find((f) => f.id === findingId)
    if (fetchedFinding) {
      setFinding(fetchedFinding)
      setFormData({
        /* ... (prefill as before) ... */
        title: fetchedFinding.title,
        description: fetchedFinding.description,
        criteria: fetchedFinding.criteria,
        condition: fetchedFinding.condition,
        cause: fetchedFinding.cause,
        effect: fetchedFinding.effect,
        recommendation: fetchedFinding.recommendation,
        severity: fetchedFinding.severity,
        associatedRisks: fetchedFinding.associatedRisks,
        responsibleBusinessOwner: fetchedFinding.responsibleBusinessOwner,
      })
      setIsFindingAcceptedByBOState(fetchedFinding.isFindingAcceptedByBO || false)
      setManagementCommentsState(fetchedFinding.managementComments || "")
      if (fetchedFinding.actionPlan) {
        setActionPlanObjectiveState(fetchedFinding.actionPlan.overallObjective || "")
        setActionPlanItemsState(fetchedFinding.actionPlan.items || [])
        setAuditorCommentsOnPlanState(fetchedFinding.actionPlan.auditorCommentsOnPlan || "")
      } else {
        // Initialize with one blank action item if no plan exists yet
        setActionPlanItemsState([
          {
            id: `item-${Date.now()}`,
            action: "",
            responsiblePerson: fetchedFinding.responsibleBusinessOwner,
            dueDate: "",
            status: "To Do",
          },
        ])
      }
    } else {
      toast({ title: "Error", description: "Finding not found.", variant: "destructive" })
    }
    setIsLoading(false)
  }, [findingId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, fieldName: keyof Finding) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value as any }))
  }

  const handleSaveChanges = () => {
    if (!finding) return
    const updatedFinding: Finding = {
      ...finding,
      ...formData,
      lastUpdated: new Date().toISOString(),
    }
    setFinding(updatedFinding)
    const index = mockFindings.findIndex((f) => f.id === finding.id)
    if (index !== -1) mockFindings[index] = updatedFinding
    toast({ title: "Changes Saved", description: "Finding details have been updated." })
  }

  const handleWorkflowAction = (newStatus: FindingStatus, actionSpecificData?: Partial<Finding>) => {
    if (!finding) return
    const updatedFindingData: Finding = {
      ...finding,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
      ...actionSpecificData,
    }
    setFinding(updatedFindingData)
    const index = mockFindings.findIndex((f) => f.id === finding.id)
    if (index !== -1) mockFindings[index] = updatedFindingData
    toast({ title: "Workflow Updated", description: `Finding status changed to ${newStatus}.` })
  }

  // --- Business Owner: Action Plan Submission ---
  const handleActionPlanItemChange = (index: number, field: keyof ActionPlanItem, value: string | Date) => {
    const newItems = [...actionPlanItemsState]
    if (field === "dueDate" && value instanceof Date) {
      newItems[index] = { ...newItems[index], [field]: value.toISOString().split("T")[0] }
    } else {
      newItems[index] = { ...newItems[index], [field]: value as string }
    }
    setActionPlanItemsState(newItems)
  }

  const addActionPlanItem = () => {
    setActionPlanItemsState([
      ...actionPlanItemsState,
      {
        id: `item-${Date.now()}`,
        action: "",
        responsiblePerson: finding?.responsibleBusinessOwner || "",
        dueDate: "",
        status: "To Do",
      },
    ])
  }

  const removeActionPlanItem = (id: string) => {
    setActionPlanItemsState(actionPlanItemsState.filter((item) => item.id !== id))
  }

  const submitManagementResponseAndActionPlan = () => {
    if (!isFindingAcceptedByBOState) {
      toast({
        title: "Acceptance Required",
        description: "Please accept the finding before submitting an action plan.",
        variant: "destructive",
      })
      return
    }
    if (
      !actionPlanObjectiveState.trim() ||
      actionPlanItemsState.some((item) => !item.action.trim() || !item.dueDate.trim())
    ) {
      toast({
        title: "Action Plan Incomplete",
        description: "Please provide an overall objective and complete all action item details (action, due date).",
        variant: "destructive",
      })
      return
    }

    const newActionPlan: ActionPlan = {
      overallObjective: actionPlanObjectiveState,
      items: actionPlanItemsState,
      submittedDate: new Date().toISOString(),
      dueDateExtensionsCount: finding?.actionPlan?.dueDateExtensionsCount || 0,
      lastDueDate:
        actionPlanItemsState.length > 0
          ? actionPlanItemsState.reduce((latest, item) =>
              new Date(item.dueDate) > new Date(latest.dueDate) ? item : latest,
            ).dueDate
          : new Date().toISOString(),
      status: "Not Started", // Default status for new action plan items
    }
    handleWorkflowAction("Action Plan Submitted", {
      isFindingAcceptedByBO: isFindingAcceptedByBOState,
      managementComments: managementCommentsState,
      actionPlan: newActionPlan,
    })
  }

  // --- Auditor: Review Action Plan ---
  const approveActionPlan = () => {
    handleWorkflowAction("Action Plan Accepted", {
      actionPlan: finding?.actionPlan
        ? {
            ...finding.actionPlan,
            isPlanAcceptedByAuditor: true,
            actionPlanApprovalDate: new Date().toISOString(),
            auditorCommentsOnPlan: auditorCommentsOnPlanState,
          }
        : undefined,
      isActionPlanApprovedByAuditor: true, // Top-level flag
      actionPlanApprovalDate: new Date().toISOString(),
      auditorCommentsOnActionPlan: auditorCommentsOnPlanState,
    })
  }

  const rejectActionPlan = () => {
    // Could revert to "Sent to Business Owner" or a new "Action Plan Rejected" status
    handleWorkflowAction("Sent to Business Owner", {
      // Or a new status like "Action Plan Rejected"
      actionPlan: finding?.actionPlan
        ? { ...finding.actionPlan, isPlanAcceptedByAuditor: false, auditorCommentsOnPlan: auditorCommentsOnPlanState }
        : undefined,
      isActionPlanApprovedByAuditor: false,
      auditorCommentsOnActionPlan: auditorCommentsOnPlanState,
    })
    toast({ title: "Action Plan Needs Revision", description: "Comments sent to Business Owner.", variant: "default" })
  }

  const extendActionPlanDueDate = () => {
    if (!newDueDateForExtension || !finding?.actionPlan) {
      toast({ title: "Invalid Date", description: "Please select a new due date.", variant: "destructive" })
      return
    }
    if (finding.actionPlan.dueDateExtensionsCount >= 3) {
      toast({
        title: "Extension Limit Reached",
        description: "Cannot extend due date more than 3 times.",
        variant: "destructive",
      })
      return
    }
    const updatedActionPlan: ActionPlan = {
      ...finding.actionPlan,
      lastDueDate: newDueDateForExtension.toISOString(), // Update the last due date
      dueDateExtensionsCount: finding.actionPlan.dueDateExtensionsCount + 1,
    }
    // Potentially update individual item due dates or just the overall plan's last due date
    handleWorkflowAction(finding.status, { actionPlan: updatedActionPlan }) // Status remains the same
    setNewDueDateForExtension(undefined)
  }

  // Other workflow handlers (submitForVerification, auditorVerifyFinding, etc. from previous step)
  const submitForVerification = () => handleWorkflowAction("Pending Verification")
  const auditorVerifyFinding = () =>
    handleWorkflowAction("Verified", {
      verifiedByAuditor: { name: currentAuditor.name, date: new Date().toISOString() },
    })
  const sendToBusinessOwner = () =>
    handleWorkflowAction("Sent to Business Owner", { sentToBusinessOwnerDate: new Date().toISOString() })
  const startRemediation = () => handleWorkflowAction("In Remediation") // After Action Plan Accepted
  const requestRemediationVerification = () => handleWorkflowAction("Remediation Pending Verification")
  const auditorVerifyRemediation = () =>
    handleWorkflowAction("Resolved", {
      remediationVerifiedByAuditor: { name: currentAuditor.name, date: new Date().toISOString() },
    })
  const closeFinding = () => handleWorkflowAction("Closed", { closedDate: new Date().toISOString() })

  if (isLoading) {
    /* ... loading UI ... */ return <p>Loading...</p>
  }
  if (!finding) {
    /* ... not found UI ... */ return <p>Finding not found.</p>
  }

  const isFindingDetailsEditable = finding.status === "Draft" || finding.status === "Pending Verification"
  const canBORespond = finding.status === "Sent to Business Owner" && currentUserRole === "BusinessOwner"
  const canAuditorReviewPlan = finding.status === "Action Plan Submitted" && currentUserRole === "Auditor"
  const canAuditorManageRemediation =
    (finding.status === "Action Plan Accepted" ||
      finding.status === "In Remediation" ||
      finding.status === "Remediation Pending Verification") &&
    currentUserRole === "Auditor"

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header and Basic Finding Details (as before) */}
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href={finding.assignmentId ? `/assignments/${finding.assignmentId}` : "/dashboard"}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-semibold text-foreground flex-grow mr-4 break-words">
            Manage Finding: {finding.title}
          </h1>
          <Badge className="mt-2 sm:mt-0 text-sm px-3 py-1 whitespace-nowrap">{finding.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Created: {new Date(finding.dateCreated).toLocaleDateString()} | Last Updated:{" "}
          {new Date(finding.lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Finding Details Form (conditionally editable) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Info className="mr-2 h-5 w-5 text-primary" />
            Finding Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ... Title, Description, Criteria, etc. fields ... */}
          {/* Example for title: */}
          <div>
            <Label htmlFor="title">Finding Title / Headline</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              readOnly={!isFindingDetailsEditable}
            />
          </div>
          {/* Add other finding detail fields here, similar to the create page, with readOnly={!isFindingDetailsEditable} */}
          <div>
            <Label htmlFor="description">Detailed Description (Observation)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={5}
              readOnly={!isFindingDetailsEditable}
            />
          </div>
          {/* ... other fields ... */}
          {isFindingDetailsEditable && currentUserRole === "Auditor" && (
            <div className="text-right">
              <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" /> Save Finding Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Business Owner: Management Response & Action Plan Creation --- */}
      {finding.status === "Sent to Business Owner" && (
        <Card className="mb-6 border-blue-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-blue-700">
              <MessageSquare className="mr-2 h-5 w-5" /> Management Response & Action Plan
            </CardTitle>
            <CardDescription>
              Please review the finding and provide your comments and a detailed action plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptFinding"
                checked={isFindingAcceptedByBOState}
                onCheckedChange={(checked) => setIsFindingAcceptedByBOState(!!checked)}
                disabled={currentUserRole !== "BusinessOwner"}
              />
              <Label htmlFor="acceptFinding" className="font-medium">
                I acknowledge and accept this finding.
              </Label>
            </div>
            <div>
              <Label htmlFor="managementComments">Management Comments</Label>
              <Textarea
                id="managementComments"
                value={managementCommentsState}
                onChange={(e) => setManagementCommentsState(e.target.value)}
                placeholder="Provide your comments on this finding..."
                rows={3}
                disabled={currentUserRole !== "BusinessOwner"}
              />
            </div>
            <div>
              <Label htmlFor="actionPlanObjective">Overall Action Plan Objective</Label>
              <Textarea
                id="actionPlanObjective"
                value={actionPlanObjectiveState}
                onChange={(e) => setActionPlanObjectiveState(e.target.value)}
                placeholder="Describe the main goal of your action plan..."
                rows={2}
                disabled={currentUserRole !== "BusinessOwner"}
              />
            </div>

            <Label className="font-medium">Action Plan Items</Label>
            {actionPlanItemsState.map((item, index) => (
              <Card key={item.id} className="p-3 space-y-2 bg-muted/50">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold">Action Item #{index + 1}</p>
                  {actionPlanItemsState.length > 1 && currentUserRole === "BusinessOwner" && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeActionPlanItem(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <Label htmlFor={`action-${item.id}`}>Action</Label>
                  <Textarea
                    id={`action-${item.id}`}
                    value={item.action}
                    onChange={(e) => handleActionPlanItemChange(index, "action", e.target.value)}
                    placeholder="Specific action to be taken"
                    rows={2}
                    disabled={currentUserRole !== "BusinessOwner"}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`responsible-${item.id}`}>Responsible Person</Label>
                    <Input
                      id={`responsible-${item.id}`}
                      value={item.responsiblePerson}
                      onChange={(e) => handleActionPlanItemChange(index, "responsiblePerson", e.target.value)}
                      placeholder="Name or Team"
                      disabled={currentUserRole !== "BusinessOwner"}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`dueDate-${item.id}`}>Due Date</Label>
                    <Input
                      id={`dueDate-${item.id}`}
                      type="date"
                      value={item.dueDate}
                      onChange={(e) => handleActionPlanItemChange(index, "dueDate", e.target.value)}
                      disabled={currentUserRole !== "BusinessOwner"}
                    />
                  </div>
                </div>
              </Card>
            ))}
            {currentUserRole === "BusinessOwner" && (
              <Button variant="outline" size="sm" onClick={addActionPlanItem} className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Action Item
              </Button>
            )}

            {currentUserRole === "BusinessOwner" && (
              <div className="pt-4 text-right">
                <Button onClick={submitManagementResponseAndActionPlan} disabled={!isFindingAcceptedByBOState}>
                  <Send className="mr-2 h-4 w-4" /> Submit Response & Action Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- Auditor: Review & Manage Action Plan --- */}
      {finding.status === "Action Plan Submitted" && finding.actionPlan && (
        <Card className="mb-6 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-yellow-700">
              <ListChecks className="mr-2 h-5 w-5" /> Review Submitted Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {finding.isFindingAcceptedByBO && (
              <p className="text-sm font-semibold text-green-600">Finding Accepted by Business Owner.</p>
            )}
            {finding.managementComments && (
              <div>
                <Label className="font-medium">Management Comments:</Label>
                <p className="text-sm p-2 bg-muted rounded whitespace-pre-wrap">{finding.managementComments}</p>
              </div>
            )}
            <div>
              <Label className="font-medium">Overall Action Plan Objective:</Label>
              <p className="text-sm p-2 bg-muted rounded whitespace-pre-wrap">{finding.actionPlan.overallObjective}</p>
            </div>
            <Label className="font-medium">Action Plan Items:</Label>
            {finding.actionPlan.items.map((item, index) => (
              <div key={item.id} className="text-sm p-2 border rounded bg-muted/30">
                <p>
                  <strong>#{index + 1}:</strong> {item.action}
                </p>
                <p>
                  <strong>Responsible:</strong> {item.responsiblePerson}
                </p>
                <p>
                  <strong>Due:</strong> {new Date(item.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Submitted on: {new Date(finding.actionPlan.submittedDate).toLocaleString()}
            </p>

            {currentUserRole === "Auditor" && (
              <>
                <div className="mt-4">
                  <Label htmlFor="auditorCommentsOnPlan">Auditor Comments on Action Plan (Optional)</Label>
                  <Textarea
                    id="auditorCommentsOnPlan"
                    value={auditorCommentsOnPlanState}
                    onChange={(e) => setAuditorCommentsOnPlanState(e.target.value)}
                    placeholder="Provide feedback or comments on the action plan..."
                    rows={3}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button onClick={approveActionPlan} className="bg-green-600 hover:bg-green-700">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Approve Action Plan
                  </Button>
                  <Button onClick={rejectActionPlan} variant="destructive">
                    <ThumbsDown className="mr-2 h-4 w-4" /> Request Revision
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- Auditor: Extend Due Date (Visible when plan is accepted/in progress) --- */}
      {(finding.status === "Action Plan Accepted" || finding.status === "In Remediation") &&
        finding.actionPlan &&
        currentUserRole === "Auditor" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CalendarPlus className="mr-2 h-5 w-5" /> Manage Action Plan Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Current Overall Due Date:{" "}
                <span className="font-semibold">
                  {finding.actionPlan.lastDueDate
                    ? new Date(finding.actionPlan.lastDueDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </p>
              <p className="text-sm">
                Extensions Used: <span className="font-semibold">{finding.actionPlan.dueDateExtensionsCount} / 3</span>
              </p>
              {finding.actionPlan.dueDateExtensionsCount < 3 ? (
                <div className="flex flex-col sm:flex-row items-end gap-2">
                  <div className="flex-grow">
                    <Label htmlFor="newDueDateExtension">New Due Date</Label>
                    <DatePicker date={newDueDateForExtension} setDate={setNewDueDateForExtension} />
                  </div>
                  <Button onClick={extendActionPlanDueDate} disabled={!newDueDateForExtension}>
                    Extend Due Date
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-destructive">Maximum due date extensions reached.</p>
              )}
            </CardContent>
          </Card>
        )}

      {/* Workflow Buttons for Auditor (Verify Finding, Send to BO, etc.) */}
      {currentUserRole === "Auditor" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Auditor Workflow Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-2">
            {finding.status === "Draft" && (
              <Button onClick={submitForVerification}>
                <Send className="mr-2 h-4 w-4" /> Submit for Verification
              </Button>
            )}
            {finding.status === "Pending Verification" && (
              <Button onClick={auditorVerifyFinding} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <ShieldCheck className="mr-2 h-4 w-4" /> Verify Finding
              </Button>
            )}
            {finding.status === "Verified" && (
              <Button onClick={sendToBusinessOwner} className="bg-green-600 hover:bg-green-700 text-white">
                <Send className="mr-2 h-4 w-4" /> Send to Business Owner
              </Button>
            )}
            {finding.status === "Action Plan Accepted" && (
              <Button onClick={startRemediation}>
                <Hourglass className="mr-2 h-4 w-4" /> Start Remediation Tracking
              </Button>
            )}
            {/* ... other auditor actions for remediation verification, closing ... */}
            {finding.status === "In Remediation" && (
              <Button onClick={requestRemediationVerification}>
                <ClipboardCheck className="mr-2 h-4 w-4" /> Request Remediation Verification
              </Button>
            )}
            {finding.status === "Remediation Pending Verification" && (
              <Button onClick={auditorVerifyRemediation} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <ShieldCheck className="mr-2 h-4 w-4" /> Verify Remediation
              </Button>
            )}
            {finding.status === "Resolved" && (
              <Button onClick={closeFinding} className="bg-green-600 hover:bg-green-700 text-white">
                <Lock className="mr-2 h-4 w-4" /> Close Finding
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {finding.status === "Closed" && (
        <Card className="mb-6 bg-gray-100 border-gray-300">
          <CardHeader>
            <CardTitle className="text-gray-700">Finding Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This finding was closed on{" "}
              {finding.closedDate ? new Date(finding.closedDate).toLocaleDateString() : "N/A"}. No further actions are
              required.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
