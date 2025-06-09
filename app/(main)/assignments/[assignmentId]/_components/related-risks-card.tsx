"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit2, Trash2, ShieldCheck, AlertTriangle, HelpCircle } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RelatedRiskEntry, Risk, RiskRating, ControlAssessment } from "../_types/assignment-types"

// Mock available risks from library
const mockRiskLibrary: Risk[] = [
  { id: "RISK001", title: "Data Breach", description: "Unauthorized access to data.", inherentRisk: "Critical" },
  {
    id: "RISK002",
    title: "Financial Misstatement",
    description: "Errors in financial reporting.",
    inherentRisk: "High",
  },
  {
    id: "RISK003",
    title: "Regulatory Non-Compliance",
    description: "Failure to meet regulations.",
    inherentRisk: "High",
  },
  {
    id: "RISK007",
    title: "Unauthorized Access to Systems",
    description: "Unauthorized system access.",
    inherentRisk: "Medium",
  },
  { id: "RISK010", title: "Vendor Lock-in", description: "Over-reliance on a single vendor.", inherentRisk: "Medium" },
]

const riskRatingColors: Record<RiskRating, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
}

const controlAssessmentConfig: Record<ControlAssessment, { icon: React.ElementType; color: string }> = {
  Effective: { icon: ShieldCheck, color: "text-green-500" },
  "Needs Improvement": { icon: AlertTriangle, color: "text-yellow-500" },
  Ineffective: { icon: AlertTriangle, color: "text-red-500" },
  "Not Assessed": { icon: HelpCircle, color: "text-gray-500" },
}

interface RelatedRisksCardProps {
  initialRisks: RelatedRiskEntry[]
}

export default function RelatedRisksCard({ initialRisks }: RelatedRisksCardProps) {
  const [relatedRisks, setRelatedRisks] = useState<RelatedRiskEntry[]>(initialRisks)
  const [isAddRiskDialogOpen, setIsAddRiskDialogOpen] = useState(false)
  const [selectedRiskId, setSelectedRiskId] = useState<string | undefined>(undefined)

  const handleAddRisk = () => {
    if (selectedRiskId) {
      const riskToAdd = mockRiskLibrary.find((r) => r.id === selectedRiskId)
      if (riskToAdd && !relatedRisks.find((rr) => rr.risk.id === riskToAdd.id)) {
        setRelatedRisks([...relatedRisks, { risk: riskToAdd, controls: [], residualRisk: riskToAdd.inherentRisk }])
      }
    }
    setSelectedRiskId(undefined)
    setIsAddRiskDialogOpen(false)
  }

  // Placeholder functions for control management
  const handleAddControl = (riskId: string) => console.log("Add control to risk:", riskId)
  const handleEditControl = (riskId: string, controlId: string) =>
    console.log("Edit control:", controlId, "for risk:", riskId)
  const handleAssessControl = (riskId: string, controlId: string) =>
    console.log("Assess control:", controlId, "for risk:", riskId)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Related Risks & Controls</CardTitle>
          <CardDescription>Manage risks linked to this assignment and assess controls.</CardDescription>
        </div>
        <Dialog open={isAddRiskDialogOpen} onOpenChange={setIsAddRiskDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => setIsAddRiskDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Link Risk
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Risk from Library</DialogTitle>
              <DialogDescription>Select a risk to link to this assignment.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="risk-select">Select Risk</Label>
              <Select onValueChange={setSelectedRiskId} value={selectedRiskId}>
                <SelectTrigger id="risk-select">
                  <SelectValue placeholder="Choose a risk..." />
                </SelectTrigger>
                <SelectContent>
                  {mockRiskLibrary.map((risk) => (
                    <SelectItem
                      key={risk.id}
                      value={risk.id}
                      disabled={relatedRisks.some((rr) => rr.risk.id === risk.id)}
                    >
                      {risk.title} (Inherent: {risk.inherentRisk})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddRiskDialogOpen(false)
                  setSelectedRiskId(undefined)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddRisk} disabled={!selectedRiskId}>
                Link Selected Risk
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedRisks.length > 0 ? (
          relatedRisks.map((entry) => (
            <div key={entry.risk.id} className="p-4 border rounded-md bg-muted/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{entry.risk.title}</h4>
                  <p className="text-xs text-muted-foreground">{entry.risk.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setRelatedRisks(relatedRisks.filter((r) => r.risk.id !== entry.risk.id))}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Unlink
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-3 text-xs">
                <span>
                  Inherent Risk:{" "}
                  <Badge variant="outline" className={riskRatingColors[entry.risk.inherentRisk]}>
                    {entry.risk.inherentRisk}
                  </Badge>
                </span>
                {entry.residualRisk && (
                  <span>
                    Residual Risk:{" "}
                    <Badge variant="outline" className={riskRatingColors[entry.residualRisk]}>
                      {entry.residualRisk}
                    </Badge>
                  </span>
                )}
              </div>

              <div className="ml-2">
                <h5 className="text-sm font-medium mb-1">Controls:</h5>
                {entry.controls.length > 0 ? (
                  entry.controls.map((control) => {
                    const assessment = controlAssessmentConfig[control.assessment]
                    return (
                      <div
                        key={control.id}
                        className="text-xs p-2 mb-1 bg-background rounded flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{control.name}</p>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <assessment.icon className={`h-3.5 w-3.5 ${assessment.color}`} />
                            Assessment: {control.assessment} (As of: {control.lastAssessed || "N/A"})
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleAssessControl(entry.risk.id, control.id)}
                            title="Assess Control"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-muted-foreground">No controls linked yet.</p>
                )}
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs p-0 h-auto mt-1"
                  onClick={() => handleAddControl(entry.risk.id)}
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add/Link Control
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No risks linked to this assignment yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
