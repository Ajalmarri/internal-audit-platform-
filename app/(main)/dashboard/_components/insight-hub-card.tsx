"use client"

import type React from "react"
import Link from "next/link"
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
import { TimerOff, ShieldAlert, FileClock, type LucideIcon } from "lucide-react"

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

const projectedWorkloadData = [
  { month: "July '25", plannedWork: 150, teamCapacity: 160 }, // Assuming current month is June 2025
  { month: "August '25", plannedWork: 170, teamCapacity: 160 },
  { month: "September '25", plannedWork: 140, teamCapacity: 160 },
]

const efficiencyMetricsData = [
  { label: "Avg. Finding Resolution Time", value: "22 Days" },
  { label: "Avg. Audit Cycle Time", value: "45 Days" },
  { label: "Overdue Tasks / Total Tasks", value: "8%" },
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
  Overdue: { label: "Overdue", color: "hsl(var(--chart-danger))" },
  AP_Completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  AP_InProgress: { label: "In Progress", color: "hsl(var(--chart-2))" },
  AP_Overdue: { label: "Overdue", color: "hsl(var(--chart-danger))" },
  AP_NotStarted: { label: "Not Started", color: "hsl(var(--chart-4))" },
  plannedWork: { label: "Planned Work", color: "hsl(var(--chart-3))" }, // Purple
  teamCapacity: { label: "Team Capacity", color: "hsl(var(--chart-1))" }, // Blue
} satisfies Record<string, { label: string; color: string; icon?: React.ComponentType }>

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  link: string
  query?: Record<string, string>
}

const statCardsData: StatCardProps[] = [
  {
    title: "Overdue Action Plans",
    value: "12",
    icon: TimerOff,
    link: "/action-plans",
    query: { status: "Overdue" },
  },
  {
    title: "Open High-Risk Findings",
    value: "7",
    icon: ShieldAlert,
    link: "/findings",
    query: { riskLevel: "High", status: "Open" }, // Assuming 'Open' and 'High' are filterable
  },
  {
    title: "Reports Pending Approval",
    value: "3",
    icon: FileClock,
    link: "/reports",
    query: { status: "Pending Approval" },
  },
]

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
      const statusForQuery = data.name.startsWith("AP_") ? data.name.substring(3) : data.name
      router.push(`/action-plans?status=${encodeURIComponent(statusForQuery)}`)
    }
  }

  return (
    <Card className="shadow-soft border-gray-200/80 dark:border-gray-800/50 transition-shadow duration-300 hover:shadow-soft-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Insight Hub</CardTitle>
        <CardDescription>Key metrics and trends at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {statCardsData.map((stat) => (
            <Link
              href={{ pathname: stat.link, query: stat.query }}
              key={stat.title}
              className="block p-4 bg-background hover:bg-muted/50 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    nameKey="name"
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
                  margin={{ top: 5, right: 20, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis
                    dataKey="label"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                    width={80}
                    interval={0}
                  />
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                    content={<ChartTooltipContent nameKey="label" indicator="line" />}
                  />
                  <ChartLegend content={<ChartLegendContent nameKey="label" />} verticalAlign="bottom" />
                  <Bar dataKey="value" radius={4} onClick={handleActionPlanBarClick} className="cursor-pointer">
                    {actionPlanStatusData.map((entry) => (
                      <Cell
                        key={`cell-ap-${entry.name}`}
                        fill={chartConfig[entry.name as keyof typeof chartConfig]?.color || "#8884d8"}
                        className="focus:outline-none hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          {/* New Resource Forecasting & Efficiency Widget */}
          <div className="md:col-span-2 p-1">
            {" "}
            {/* md:col-span-2 to make it full width on medium screens if it's the 5th item */}
            <h3 className="text-md font-medium mb-3 text-center">Resource Forecasting & Efficiency</h3>
            {/* Projected Workload Chart */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-center text-muted-foreground">
                Projected Team Workload vs. Capacity
              </h4>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={projectedWorkloadData} margin={{ top: 5, right: 5, left: -25, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={10} interval={0} dy={10} />
                    <YAxis tickLine={false} axisLine={false} fontSize={10} unit="h" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
                    <Bar dataKey="plannedWork" fill="var(--color-plannedWork)" radius={4} name="Planned Work (hrs)" />
                    <Bar
                      dataKey="teamCapacity"
                      fill="var(--color-teamCapacity)"
                      radius={4}
                      name="Team Capacity (hrs)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            {/* Audit Efficiency Metrics */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-center text-muted-foreground">Audit Efficiency Metrics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {efficiencyMetricsData.map((metric) => (
                  <div key={metric.label} className="p-3 bg-muted/30 rounded-lg border text-center shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground truncate" title={metric.label}>
                      {metric.label}
                    </p>
                    <p className="text-xl font-bold text-primary">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
