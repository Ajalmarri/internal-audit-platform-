"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { FindingStatus } from "../../../findings/_types/finding-types"

const taskCompletionData = [
  { name: "Audit Alpha", completed: 75, pending: 25 },
  { name: "Project Beta", completed: 90, pending: 10 },
  { name: "Review Gamma", completed: 60, pending: 40 },
  { name: "Check Delta", completed: 82, pending: 18 },
]

const resourceRiskData = [
  { month: "Jan", riskScore: 30 },
  { month: "Feb", riskScore: 45 },
  { month: "Mar", riskScore: 40 },
  { month: "Apr", riskScore: 55 },
  { month: "May", riskScore: 50 },
]

// Added "Overdue" as a conceptual filter key
const findingsStatusData: { name: FindingStatus | "Overdue"; value: number; label: string }[] = [
  { name: "Pending Verification", value: 10, label: "Pending Verification" },
  { name: "Resolved", value: 40, label: "Resolved" },
  { name: "Sent to Business Owner", value: 15, label: "Sent to BO" },
  { name: "In Remediation", value: 8, label: "In Remediation" },
  { name: "Action Plan Submitted", value: 12, label: "Action Plan Submitted" },
  { name: "Overdue", value: 5, label: "Overdue" }, // Added Overdue
]

const chartConfig = {
  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  pending: { label: "Pending", color: "hsl(var(--chart-2))" },
  riskScore: { label: "Risk Score", color: "hsl(var(--chart-3))" },
  "Pending Verification": { label: "Pending Verification", color: "hsl(var(--chart-4))" },
  Resolved: { label: "Resolved", color: "hsl(var(--chart-5))" },
  "Sent to Business Owner": { label: "Sent to BO", color: "hsl(var(--chart-6))" },
  "In Remediation": { label: "In Remediation", color: "hsl(var(--chart-7))" },
  "Action Plan Submitted": { label: "Action Plan Submitted", color: "hsl(var(--chart-8))" },
  Overdue: { label: "Overdue", color: "hsl(var(--chart-danger))" }, // Assuming --chart-danger is red-ish
}

export default function InsightHubCard() {
  const router = useRouter()

  const handlePieSegmentClick = (data: any) => {
    if (data && data.name) {
      if (data.name === "Overdue") {
        router.push(`/findings?filter=overdue`)
      } else {
        router.push(`/findings?status=${encodeURIComponent(data.name)}`)
      }
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Insight Hub</CardTitle>
        <CardDescription>Key metrics and trends at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div>
          <h3 className="text-md font-medium mb-2 text-center">Task Completion Rate</h3>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taskCompletionData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div>
          <h3 className="text-md font-medium mb-2 text-center">Resource Risk Trend</h3>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={resourceRiskData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  stroke="var(--color-riskScore)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div>
          <h3 className="text-md font-medium mb-2 text-center">Findings by Status</h3>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                <Pie
                  data={findingsStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  strokeWidth={2}
                  onClick={handlePieSegmentClick}
                  className="cursor-pointer"
                >
                  {findingsStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartConfig[entry.name as keyof typeof chartConfig]?.color || "#8884d8"}
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="label" />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
