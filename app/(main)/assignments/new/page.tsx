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
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus, Link as LinkIcon, Users, AlertTriangle } from "lucide-react"
import { Combobox } from "@/components/ui/combobox" // Ensure this path is correct

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
  inherentRisk: string
}

type RiskRating = "Low" | "Medium" | "High" | "Critical"

const mockRequirementTypes: string[] = [
  "Regulatory Compliance",
  "Financial Audit",
  "Operational Review",
  "IT Security Assessment",
  "Process Improvement",
]
const riskRatingOptions: RiskRating[] = ["Low", "Medium", "High", "Critical"]

// Remove mock team members - we'll fetch real users
const mockRiskLibrary: Risk[] = [
  { id: "RISK001", title: "Data Breach", description: "Unauthorized access to sensitive data.", inherentRisk: "Critical" },
]
const assignmentStages: string[] = ["Planning", "Preparation", "Fieldwork", "Reporting", "Follow-up"]

interface AuditPlanOption {
  id: string
  title: string
}

interface NewAssignmentFormState {
  title: string
  parentAuditPlanId?: string // For Parent Audit Plan
  requirementType: string
  riskLikelihood: RiskRating
  impact: RiskRating
  inherentRisk: RiskRating
  assignedTeamMembers: UserStub[]
  linkedRisks: Risk[]
}

const initialFormState: NewAssignmentFormState = {
  title: "",
  parentAuditPlanId: undefined,
  requirementType: mockRequirementTypes[0] || "",
  riskLikelihood: "Medium",
  impact: "Medium",
  inherentRisk: "Medium",
  assignedTeamMembers: [],
  linkedRisks: [],
}

export default function CreateNewAssignmentPage() {
  const router = useRouter()
  const [formState, setFormState] = useState<NewAssignmentFormState>(initialFormState)
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false)
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false)
  const [selectedTeamMemberIds, setSelectedTeamMemberIds] = useState<Set<string>>(new Set())
  const [selectedRiskIds, setSelectedRiskIds] = useState<Set<string>>(new Set())

  const [availableAuditPlans, setAvailableAuditPlans] = useState<AuditPlanOption[]>([])
  const [availableTeamMembers, setAvailableTeamMembers] = useState<UserStub[]>([])
  const [isLoadingAuditPlans, setIsLoadingAuditPlans] = useState(false)
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false)
  const [auditPlansError, setAuditPlansError] = useState<string | null>(null)
  const [teamMembersError, setTeamMembersError] = useState<string | null>(null)

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
              // Use server's error message if available
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
        // Add avatar placeholder for each user
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

    fetchAuditPlans()
    fetchTeamMembers()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof NewAssignmentFormState) => (value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveAssignment = (e: FormEvent) => {
    e.preventDefault()
    // Basic validation for parentAuditPlanId if it's marked as required
    if (!formState.parentAuditPlanId) {
        alert("Please select a Parent Audit Plan.");
        return;
    }
    console.log("Saving assignment:", formState)
    alert("Assignment data (including parentAuditPlanId) logged to console. Implement actual save logic.")
    // Example: router.push(`/assignments/${newAssignmentId}`);
  }

  const handleCancel = () => {
    router.back()
  }

  // Team Management Dialog functions (handleManageTeam, etc.) remain the same
  const handleManageTeam = () => { setSelectedTeamMemberIds(new Set(formState.assignedTeamMembers.map((m) => m.id))); setIsTeamDialogOpen(true); }
  const handleTeamMemberToggle = (memberId: string) => { setSelectedTeamMemberIds((prev) => { const newSet = new Set(prev); if (newSet.has(memberId)) newSet.delete(memberId); else newSet.add(memberId); return newSet; }); }
  const handleConfirmTeamSelection = () => { const selectedMembers = availableTeamMembers.filter((m) => selectedTeamMemberIds.has(m.id)); setFormState((prev) => ({ ...prev, assignedTeamMembers: selectedMembers })); setIsTeamDialogOpen(false); }
  const removeTeamMember = (memberId: string) => { setFormState((prev) => ({ ...prev, assignedTeamMembers: prev.assignedTeamMembers.filter((m) => m.id !== memberId), }));}

  // Risk Management Dialog functions (handleManageRisks, etc.) remain the same
  const handleManageRisks = () => { setSelectedRiskIds(new Set(formState.linkedRisks.map((r) => r.id))); setIsRiskDialogOpen(true); }
  const handleRiskToggle = (riskId: string) => { setSelectedRiskIds((prev) => { const newSet = new Set(prev); if (newSet.has(riskId)) newSet.delete(riskId); else newSet.add(riskId); return newSet; }); }
  const handleConfirmRiskSelection = () => { const selectedRisks = mockRiskLibrary.filter((r) => selectedRiskIds.has(r.id)); setFormState((prev) => ({ ...prev, linkedRisks: selectedRisks })); setIsRiskDialogOpen(false); }
  const removeLinkedRisk = (riskId: string) => { setFormState((prev) => ({ ...prev, linkedRisks: prev.linkedRisks.filter((r) => r.id !== riskId), }));}


  const auditPlanComboboxOptions = availableAuditPlans.map((plan) => ({
    value: plan.id,
    label: plan.title,
  }))

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <form onSubmit={handleSaveAssignment}>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Input
            name="title"
            value={formState.title}
            onChange={handleInputChange}
            placeholder="Enter assignment name..."
            className="text-3xl font-semibold h-auto p-2 flex-grow"
            required
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button type="submit" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Save Assignment
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>

        {/* Process Tracker */}
        <div className="mb-6">
          {/* ProcessTracker component was removed from imports, so this will cause an error */}
          {/* <ProcessTracker stages={assignmentStages} currentStageIndex={0} /> */}
          <p className="text-muted-foreground">Process Tracker component is not available in this version.</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Fulfilment / Tasks Card */}
            <Card>
              <CardHeader><CardTitle>Fulfilment / Tasks</CardTitle><CardDescription>Manage tasks related to this assignment.</CardDescription></CardHeader>
              <CardContent><Button type="button" variant="outline" disabled><Plus className="mr-2 h-4 w-4" /> Add Task (Available after save)</Button><p className="text-sm text-muted-foreground mt-2">Tasks can be added once the assignment is created.</p></CardContent>
            </Card>
            {/* Related Risks & Controls Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Related Risks & Controls</CardTitle><CardDescription>Link existing risks from the library.</CardDescription></div><Button type="button" variant="outline" size="sm" onClick={handleManageRisks}><LinkIcon className="mr-2 h-4 w-4" /> Manage Linked Risks</Button></CardHeader>
              <CardContent>{formState.linkedRisks.length > 0 ? (<div className="space-y-2">{formState.linkedRisks.map((risk) => (<div key={risk.id} className="flex items-center justify-between p-2 border rounded-md"><div><p className="font-medium">{risk.title}</p><Badge variant="outline">{risk.inherentRisk}</Badge></div><Button variant="ghost" size="icon" onClick={() => removeLinkedRisk(risk.id)} title="Unlink Risk"><AlertTriangle className="h-4 w-4 text-red-500" /></Button></div>))}</div>) : (<p className="text-sm text-muted-foreground">No risks linked yet.</p>)}</CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Requirement Details Card */}
            <Card>
              <CardHeader><CardTitle>Requirement Details</CardTitle><CardDescription>Specify the core requirement for this assignment.</CardDescription></CardHeader>
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
                          ? `Error: ${auditPlansError}` // Display the actual error message
                          : availableAuditPlans.length === 0 
                            ? "No audit plans found."
                            : "No matching audit plans."
                    }
                    disabled={isLoadingAuditPlans} // Only disable if loading, allow interaction even if error to see message
                  />
                  {auditPlansError && !isLoadingAuditPlans && <p className="text-sm text-red-500 mt-1">{auditPlansError}</p>}
                </div>

                {/* Other fields in Requirement Details card */}
                <div><Label htmlFor="requirementType">Type</Label><Select name="requirementType" value={formState.requirementType} onValueChange={handleSelectChange("requirementType")}><SelectTrigger id="requirementType"><SelectValue placeholder="Select requirement type" /></SelectTrigger><SelectContent>{mockRequirementTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select></div>
                <div><Label htmlFor="riskLikelihood">Risk Likelihood</Label><Select name="riskLikelihood" value={formState.riskLikelihood} onValueChange={handleSelectChange("riskLikelihood")}><SelectTrigger id="riskLikelihood"><SelectValue placeholder="Select likelihood" /></SelectTrigger><SelectContent>{riskRatingOptions.map((level) => (<SelectItem key={level} value={level}>{level}</SelectItem>))}</SelectContent></Select></div>
                <div><Label htmlFor="impact">Impact</Label><Select name="impact" value={formState.impact} onValueChange={handleSelectChange("impact")}><SelectTrigger id="impact"><SelectValue placeholder="Select impact" /></SelectTrigger><SelectContent>{riskRatingOptions.map((level) => (<SelectItem key={level} value={level}>{level}</SelectItem>))}</SelectContent></Select></div>
                <div><Label htmlFor="inherentRisk">Inherent Risk</Label><Select name="inherentRisk" value={formState.inherentRisk} onValueChange={handleSelectChange("inherentRisk")}><SelectTrigger id="inherentRisk"><SelectValue placeholder="Select inherent risk" /></SelectTrigger><SelectContent>{riskRatingOptions.map((level) => (<SelectItem key={level} value={level}>{level}</SelectItem>))}</SelectContent></Select></div>
              </CardContent>
            </Card>

            {/* Assigned Team Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Assigned Team</CardTitle><CardDescription>Select team members for this assignment.</CardDescription></div><Button type="button" variant="outline" size="sm" onClick={handleManageTeam}><Users className="mr-2 h-4 w-4" /> Manage Team</Button></CardHeader>
              <CardContent>{formState.assignedTeamMembers.length > 0 ? (<div className="space-y-2">{formState.assignedTeamMembers.map((member) => (<div key={member.id} className="flex items-center justify-between p-2 border rounded-md"><div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} /><AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar><span className="text-sm font-medium">{member.name}</span></div><Button variant="ghost" size="icon" onClick={() => removeTeamMember(member.id)} title="Remove Member"><AlertTriangle className="h-4 w-4 text-red-500" /></Button></div>))}</div>) : (<p className="text-sm text-muted-foreground">No team members assigned yet.</p>)}</CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Team Management Dialog */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Manage Team Members</DialogTitle><DialogDescription>Select team members to assign to this assignment.</DialogDescription></DialogHeader><div className="space-y-2 py-4">{availableTeamMembers.map((member) => (<div key={member.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md"><Checkbox id={`team-${member.id}`} checked={selectedTeamMemberIds.has(member.id)} onCheckedChange={() => handleTeamMemberToggle(member.id)} /><Label htmlFor={`team-${member.id}`} className="flex items-center gap-2 cursor-pointer flex-grow"><Avatar className="h-8 w-8"><AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} /><AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>{member.name}</Label></div>))}</div></DialogContent></Dialog>
      {/* Risk Management Dialog */}
      <Dialog open={isRiskDialogOpen} onOpenChange={setIsRiskDialogOpen}><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Manage Linked Risks</DialogTitle><DialogDescription>Select risks from the library to link to this assignment.</DialogDescription></DialogHeader><div className="space-y-2 py-4">{mockRiskLibrary.map((risk) => (<div key={risk.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md"><Checkbox id={`risk-${risk.id}`} checked={selectedRiskIds.has(risk.id)} onCheckedChange={() => handleRiskToggle(risk.id)} /><Label htmlFor={`risk-${risk.id}`} className="cursor-pointer flex-grow">{risk.title}{" "}<Badge variant="outline" className="ml-2">{risk.inherentRisk}</Badge></Label></div>))}</div></DialogContent></Dialog>
    </div>
  )
}
