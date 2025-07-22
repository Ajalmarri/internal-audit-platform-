import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
]

export function DepartmentRiskProfileWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Risk Profile</CardTitle>
        <CardDescription>Finance Department</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {riskProfiles.map((risk) => (
          <div key={risk.category}>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="font-medium">{risk.category}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold">{risk.value}%</span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    risk.level === "High" && "text-red-500",
                    risk.level === "Medium" && "text-yellow-600",
                    risk.level === "Low" && "text-green-600",
                  )}
                >
                  {risk.level}
                </span>
              </div>
            </div>
            <Progress value={risk.value} className={cn("[&>div]:", risk.color)} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
