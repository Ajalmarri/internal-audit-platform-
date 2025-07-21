import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const riskProfiles = [
  {
    category: "Financial Risk",
    value: 75,
    level: "High",
    color: "bg-red-500",
  },
  {
    category: "Operational Risk",
    value: 45,
    level: "Medium",
    color: "bg-yellow-500",
  },
  {
    category: "Compliance Risk",
    value: 20,
    level: "Low",
    color: "bg-green-500",
  },
  {
    category: "Strategic Risk",
    value: 60,
    level: "Medium",
    color: "bg-yellow-500",
  },
]

export function DepartmentRiskProfileWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Risk Profile (Finance)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riskProfiles.map((risk) => (
            <div key={risk.category}>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium">{risk.category}</span>
                <span className="text-sm text-muted-foreground">
                  {risk.value}% ({risk.level})
                </span>
              </div>
              <Progress value={risk.value} indicatorClassName={cn(risk.color)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
