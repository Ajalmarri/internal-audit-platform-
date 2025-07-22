import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Clock } from "lucide-react"

const kpis = [
  {
    title: "Budget Utilization",
    value: "87%",
    change: "+5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Team Productivity",
    value: "94%",
    change: "+2%",
    trend: "up" as const,
    icon: Users,
  },
  {
    title: "Compliance Score",
    value: "92%",
    change: "-3%",
    trend: "down" as const,
    icon: Target,
  },
  {
    title: "Avg Response Time",
    value: "2.3 days",
    change: "-0.5 days",
    trend: "up" as const,
    icon: Clock,
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
                <span className="text-sm font-medium text-muted-foreground">{kpi.title}</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <div className="flex items-center gap-1">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
