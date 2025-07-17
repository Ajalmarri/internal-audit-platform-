"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { XIcon, Save, Ban, Search, LinkIcon } from "lucide-react"
import toast from "react-hot-toast"

// Mock data for risk library - in a real app, this would come from an API
const mockRiskLibrary = [
  { id: "risk-001", name: "Data Breach due to Unpatched System", category: "IT Security" },
  { id: "risk-002", name: "Unauthorized System Access", category: "Access Control" },
  { id: "risk-003", name: "Financial Misstatement", category: "Financial Reporting" },
  { id: "risk-004", name: "Third-Party Vendor Risk", category: "Vendor Management" },
  { id: "risk-005", name: "Regulatory Non-Compliance", category: "Compliance" },
  { id: "risk-006", name: "Insider Threat", category: "Human Resources" },
  { id: "risk-007", name: "System Outage", category: "Business Continuity" },
]

type ControlFormState = {
  name: string
  description: string
  type: string
  status: string
  effectiveness: string
  linkedRiskIds: string[]
}

export default function AddNewControlPage() {
  const router = useRouter()
  const [formState, setFormState] = useState<ControlFormState>({
    name: "",
    description: "",
    type: "",
    status: "",
    effectiveness: "",
    linkedRiskIds: [],
  })
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false)
  const [riskSearchTerm, setRiskSearchTerm] = useState("")
  const [tempSelectedRiskIds, setTempSelectedRiskIds] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveControl = () => {
    console.log("Saving control:", formState)
    // In a real application, you would make an API call here
    // e.g., await fetch('/api/controls', { method: 'POST', body: JSON.stringify(formState) })
    toast.success("Control saved successfully! (Placeholder)")
    // router.push('/controls'); // Optionally navigate after save
  }

  const handleCancel = () => {
    router.back()
  }

  const openRiskDialog = () => {
    setTempSelectedRiskIds([...formState.linkedRiskIds])
    setRiskSearchTerm("")
    setIsRiskDialogOpen(true)
  }

  const handleRiskSelectionChange = (riskId: string) => {
    setTempSelectedRiskIds((prev) => (prev.includes(riskId) ? prev.filter((id) => id !== riskId) : [...prev, riskId]))
  }

  const confirmRiskSelection = () => {
    setFormState((prev) => ({ ...prev, linkedRiskIds: tempSelectedRiskIds }))
    setIsRiskDialogOpen(false)
  }

  const removeLinkedRisk = (riskIdToRemove: string) => {
    setFormState((prev) => ({
      ...prev,
      linkedRiskIds: prev.linkedRiskIds.filter((id) => id !== riskIdToRemove),
    }))
  }

  const filteredRisks = useMemo(() => {
    return mockRiskLibrary.filter((risk) => risk.name.toLowerCase().includes(riskSearchTerm.toLowerCase()))
  }, [riskSearchTerm])

  const getRiskNameById = (riskId: string) => {
    return mockRiskLibrary.find((risk) => risk.id === riskId)?.name || "Unknown Risk"
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-background border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Add New Control</h1>
            <p className="text-sm text-muted-foreground">Define a new mitigating control for the Controls Library.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <Ban className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveControl}>
              <Save className="mr-2 h-4 w-4" />
              Save Control
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Control Details</CardTitle>
                <CardDescription>Provide the core information for this control.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Control Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter the name of the control..."
                    value={formState.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed description of the control's purpose and function..."
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type">Control Type</Label>
                    <Select
                      name="type"
                      onValueChange={(value) => handleSelectChange("type", value)}
                      value={formState.type}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                        <SelectItem value="Detective">Detective</SelectItem>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      onValueChange={(value) => handleSelectChange("status", value)}
                      value={formState.status}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="effectiveness">Initial Effectiveness</Label>
                    <Select
                      name="effectiveness"
                      onValueChange={(value) => handleSelectChange("effectiveness", value)}
                      value={formState.effectiveness}
                    >
                      <SelectTrigger id="effectiveness">
                        <SelectValue placeholder="Select effectiveness..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Effective">Effective</SelectItem>
                        <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                        <SelectItem value="Ineffective">Ineffective</SelectItem>
                        <SelectItem value="Not Assessed">Not Assessed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Link to Risks</CardTitle>
                <CardDescription>Connect this control to relevant risks it mitigates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full mb-4" onClick={openRiskDialog}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Manage Linked Risks
                </Button>
                {formState.linkedRiskIds.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Linked Risks:</p>
                    <div className="flex flex-wrap gap-2">
                      {formState.linkedRiskIds.map((riskId) => (
                        <Badge key={riskId} variant="secondary" className="flex items-center">
                          {getRiskNameById(riskId)}
                          <button
                            onClick={() => removeLinkedRisk(riskId)}
                            className="ml-1.5 p-0.5 rounded-full hover:bg-muted-foreground/20"
                            aria-label={`Remove ${getRiskNameById(riskId)}`}
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No risks linked yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isRiskDialogOpen} onOpenChange={setIsRiskDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Link Risks to Control</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search risks by name..."
                className="pl-8 w-full"
                value={riskSearchTerm}
                onChange={(e) => setRiskSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {filteredRisks.length > 0 ? (
                filteredRisks.map((risk) => (
                  <div key={risk.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                    <Checkbox
                      id={`risk-${risk.id}`}
                      checked={tempSelectedRiskIds.includes(risk.id)}
                      onCheckedChange={() => handleRiskSelectionChange(risk.id)}
                    />
                    <label
                      htmlFor={`risk-${risk.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                    >
                      {risk.name}
                      <p className="text-xs text-muted-foreground">{risk.category}</p>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground py-4">No risks found matching your search.</p>
              )}
            </ScrollArea>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmRiskSelection}>Update Linked Risks</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
