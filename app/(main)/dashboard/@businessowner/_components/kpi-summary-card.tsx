import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, CheckCircle } from "lucide-react"

const kpis = [
  {
    title: "Control Effectiveness",
    value: "92%",
    change: "+2% vs last quarter",
    icon: CheckCircle,
    status: "success" as const,
  },
  {
    title: "Open Findings",
    value: "8",
    change: "-3 vs last quarter",
    icon: Target,
    status: "success" as const,
  },
  {
    title: "Overdue Action Plans",
    value: "2",
    change: "+1 vs last quarter",
    icon: TrendingDown,
    status: "danger" as const,
  },
  {
    title: "Policy Compliance",
    value: "98%",
    change: "Stable",
    icon: TrendingUp,
    status: "success" as const,
  },
]

export function KpiSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="p-4 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
              <kpi.icon className={`h-5 w-5 ${kpi.status === "success" ? "text-green-500" : "text-red-500"}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
