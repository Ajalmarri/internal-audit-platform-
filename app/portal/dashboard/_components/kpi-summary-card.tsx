import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const kpis = [
  { title: "Revenue Growth", value: "+5.2%", trend: "up" },
  { title: "Customer Satisfaction", value: "92%", trend: "up" },
  { title: "Operational Cost", value: "-1.8%", trend: "down" },
  { title: "Employee Turnover", value: "8%", trend: "neutral" },
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
        <CardTitle>Key Performance Indicators</CardTitle>
        <CardDescription>A snapshot of your department's performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.title} className="p-4 rounded-lg border bg-card text-card-foreground">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <TrendIcon trend={kpi.trend} />
              </div>
              <p className="text-2xl font-bold mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
