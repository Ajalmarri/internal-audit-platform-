"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Clock } from "lucide-react"

const kpis = [
  {
    title: "Budget Utilization",
    value: "87%",
    change: "+5%",
    trend: "up" as const,
    icon: DollarSign,
    description: "vs last quarter",
  },
  {
    title: "Team Productivity",
    value: "94%",
    change: "+2%",
    trend: "up" as const,
    icon: Users,
    description: "efficiency score",
  },
  {
    title: "Goal Achievement",
    value: "78%",
    change: "-3%",
    trend: "down" as const,
    icon: Target,
    description: "quarterly targets",
  },
  {
    title: "Process Efficiency",
    value: "91%",
    change: "+7%",
    trend: "up" as const,
    icon: Clock,
    description: "time optimization",
  },
]

export function KpiSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{kpi.title}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
