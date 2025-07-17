import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const kpis = [
  { title: "Customer Satisfaction", value: "92%", change: "+2%", trend: "up" },
  { title: "On-time Delivery", value: "98.5%", change: "-0.5%", trend: "down" },
  { title: "Sales Growth (QoQ)", value: "5.2%", change: "+1.2%", trend: "up" },
  { title: "Employee Turnover", value: "8%", change: "0%", trend: "same" },
]

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-5 w-5 text-green-500" />
  if (trend === "down") return <TrendingDown className="h-5 w-5 text-red-500" />
  return <Minus className="h-5 w-5 text-muted-foreground" />
}

export function KpiSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators (KPIs)</CardTitle>
        <CardDescription>Summary of your department's performance this quarter.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.title} className="p-4 bg-muted/50 rounded-lg flex flex-col justify-between">
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <div className="flex items-center">
                  <TrendIcon trend={kpi.trend} />
                  <span className="text-xs text-muted-foreground">{kpi.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
