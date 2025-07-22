import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, AlertCircle } from "lucide-react"

const riskCategories = [
  {
    name: "Financial Risk",
    level: 75,
    status: "High" as const,
    trend: "increasing" as const,
  },
  {
    name: "Operational Risk",
    level: 45,
    status: "Medium" as const,
    trend: "stable" as const,
  },
  {
    name: "Compliance Risk",
    level: 20,
    status: "Low" as const,
    trend: "decreasing" as const,
  },
  {
    name: "Cybersecurity Risk",
    level: 60,
    status: "Medium" as const,
    trend: "increasing" as const,
  },
]

const getRiskColor = (level: number) => {
  if (level >= 70) return "bg-red-500"
  if (level >= 40) return "bg-yellow-500"
  return "bg-green-500"
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "High":
      return "text-red-600"
    case "Medium":
      return "text-yellow-600"
    case "Low":
      return "text-green-600"
    default:
      return "text-gray-600"
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "increasing":
      return <TrendingUp className="h-4 w-4 text-red-500" />
    case "decreasing":
      return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
    case "stable":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    default:
      return null
  }
}

export function DepartmentRiskProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Department Risk Profile (Finance)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {riskCategories.map((risk) => (
            <div key={risk.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{risk.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getStatusColor(risk.status)}`}>
                    {risk.level}% - {risk.status}
                  </span>
                  {getTrendIcon(risk.trend)}
                </div>
              </div>
              <Progress
                value={risk.level}
                className="h-2"
                style={
                  {
                    "--progress-background": getRiskColor(risk.level),
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
