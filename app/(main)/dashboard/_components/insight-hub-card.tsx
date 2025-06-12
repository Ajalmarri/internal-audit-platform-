"use client"

import type React from "react"

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

const findingsStatusData: { name: FindingStatus | "Overdue"; value: number; label: string }[] = [
  { name: "Pending Verification", value: 10, label: "Pending Verification" },
  { name: "Resolved", value: 40, label: "Resolved" },
  { name: "Sent to Business Owner", value: 15, label: "Sent to BO" },
  { name: "In Remediation", value: 8, label: "In Remediation" },
  { name: "Action Plan Submitted", value: 12, label: "Action Plan Submitted" },
  { name: "Overdue", value: 5, label: "Overdue" },
]

const actionPlanStatusData = [
  { name: "AP_Completed", value: 55, label: "Completed" },
  { name: "AP_InProgress", value: 20, label: "In Progress" },
  { name: "AP_Overdue", value: 12, label: "Overdue" },
  { name: "AP_NotStarted", value: 10, label: "Not Started" },
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
  Overdue: { label: "Overdue", color: "hsl(var(--chart-danger))" }, // For Findings
  // Action Plan Statuses - using distinct keys for clarity
  AP_Completed: { label: "Completed", color: "hsl(var(--chart-1))" }, // Reusing chart-1 for AP Completed
  AP_InProgress: { label: "In Progress", color: "hsl(var(--chart-2))" }, // Reusing chart-2 for AP In Progress
  AP_Overdue: { label: "Overdue", color: "hsl(var(--chart-danger))" }, // Reusing chart-danger for AP Overdue
  AP_NotStarted: { label: "Not Started", color: "hsl(var(--chart-4))" }, // Reusing chart-4 for AP Not Started
} satisfies Record<string, { label: string; color: string; icon?: React.ComponentType }>

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

  const handleActionPlanBarClick = (data: any) => {
    if (data && data.name) {
      // Map AP_Completed to Completed, AP_InProgress to In Progress etc.
      const statusForQuery = data.name.startsWith("AP_") ? data.name.substring(3) : data.name
      router.push(`/action-plans?status=${encodeURIComponent(statusForQuery)}`)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Insight Hub</CardTitle>
        <CardDescription>Key metrics and trends at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div>
          <h3 className="text-md font-medium mb-2 text-center">Task Completion Rate</h3>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taskCompletionData} margin={{ top: 5, right: 5, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} interval={0} dy={10} />
                <YAxis tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
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
              <LineChart data={resourceRiskData} margin={{ top: 5, right: 20, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={10} interval={0} dy={10} />
                <YAxis tickLine={false} axisLine={false} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
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
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                <Pie
                  data={findingsStatusData}
                  dataKey="value"
                  nameKey="name" // Internal key for matching config
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  strokeWidth={2}
                  onClick={handlePieSegmentClick}
                  className="cursor-pointer"
                >
                  {findingsStatusData.map((entry) => (
                    <Cell
                      key={`cell-finding-${entry.name}`}
                      fill={chartConfig[entry.name as keyof typeof chartConfig]?.color || "#8884d8"}
                      className="focus:outline-none hover:opacity-80"
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="label" />} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div>
          <h3 className="text-md font-medium mb-2 text-center">Action Plan Status</h3>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={actionPlanStatusData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 50, bottom: 20 }} // Adjusted left margin for YAxis labels
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} />
                <YAxis
                  dataKey="label" // Use the 'label' field for Y-axis display
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  width={80} // Adjust width if labels are long
                  interval={0}
                />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.5)" }} // Hover effect on bar
                  content={<ChartTooltipContent nameKey="label" indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent nameKey="label" />} verticalAlign="bottom" />
                <Bar dataKey="value" radius={4} onClick={handleActionPlanBarClick} className="cursor-pointer">
                  {actionPlanStatusData.map((entry) => (
                    <Cell
                      key={`cell-ap-${entry.name}`}
                      fill={chartConfig[entry.name as keyof typeof chartConfig]?.color || "#8884d8"}
                      className="focus:outline-none hover:opacity-80" // Added hover opacity
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
