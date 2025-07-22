"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const riskCategories = [
  {
    name: "Financial Risk",
    level: 75,
    status: "high" as const,
    trend: "up" as const,
    description: "Budget variance and cash flow concerns",
  },
  {
    name: "Operational Risk",
    level: 45,
    status: "medium" as const,
    trend: "down" as const,
    description: "Process efficiency and resource allocation",
  },
  {
    name: "Compliance Risk",
    level: 20,
    status: "low" as const,
    trend: "stable" as const,
    description: "Regulatory adherence and policy compliance",
  },
  {
    name: "Technology Risk",
    level: 60,
    status: "medium" as const,
    trend: "up" as const,
    description: "System security and data protection",
  },
]

const getRiskColor = (status: string) => {
  switch (status) {
    case "high":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-red-500" />
    case "down":
      return <TrendingDown className="h-4 w-4 text-green-500" />
    case "stable":
      return <Minus className="h-4 w-4 text-gray-500" />
    default:
      return <Minus className="h-4 w-4 text-gray-500" />
  }
}

export function DepartmentRiskProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Risk Profile (Finance)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {riskCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{category.name}</h4>
                  {getTrendIcon(category.trend)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{category.level}%</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full text-white ${
                      category.status === "high"
                        ? "bg-red-500"
                        : category.status === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  >
                    {category.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <Progress
                value={category.level}
                className="h-2"
                style={{
                  background: `linear-gradient(to right, ${getRiskColor(category.status)} 0%, ${getRiskColor(category.status)} ${category.level}%, #e5e7eb ${category.level}%, #e5e7eb 100%)`,
                }}
              />
              <p className="text-xs text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Overall Risk Score:</span>
            <span className="font-medium">50% (Medium)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
