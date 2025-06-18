import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AssignmentRequirement, RiskRating } from "../_types/assignment-types"

interface RequirementDetailsCardProps {
  requirements: AssignmentRequirement
}

const ratingColors: Record<RiskRating | string, string> = {
  Low: "bg-green-100 text-green-700 border-green-300",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  High: "bg-orange-100 text-orange-700 border-orange-300",
  Critical: "bg-red-100 text-red-700 border-red-300",
}

export default function RequirementDetailsCard({ requirements }: RequirementDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Requirement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type:</span>
          <span className="font-medium">{requirements.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Risk Likelihood:</span>
          <Badge variant="outline" className={ratingColors[requirements.riskLikelihood] || "border-gray-300"}>
            {requirements.riskLikelihood}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Impact:</span>
          <Badge variant="outline" className={ratingColors[requirements.impact] || "border-gray-300"}>
            {requirements.impact}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Inherent Risk:</span>
          <Badge variant="outline" className={ratingColors[requirements.inherentRisk] || "border-gray-300"}>
            {requirements.inherentRisk}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
