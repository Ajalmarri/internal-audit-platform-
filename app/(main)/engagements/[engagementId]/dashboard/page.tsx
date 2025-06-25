"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation" // Import useRouter
import Link from "next/link"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, LabelList } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, Users, CalendarDays, ListChecks, PieChartIcon, BarChartIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// --- Ideally, this type and data would come from a shared file ---
interface EngagementKpi {
  label: string
  slug: string // e.g., "open-findings", "overdue-actions"
  count: number
  type: "warning" | "critical" | "success" | "neutral"
  color?: string
}

interface TaskStats {
  pending: number
  inProgress: number
  completed: number
  onHold?: number
}

interface Engagement {
  id: string
  title: string
  client: string
  status: "Planning" | "In Progress" | "In Review" | "Completed" | "On Hold"
  startDate: string
  endDate: string
  manager: string
  teamSize: number
  description?: string
  kpis?: EngagementKpi[]
  progress?: number
  recentActivity?: { timestamp: string; message: string }[]
  teamMembers?: string[]
  taskStats?: TaskStats
}

const mockEngagements: Engagement[] = [
  {
    id: "ENG-001",
    title: "2025 Annual IT Security Audit",
    client: "Global Tech Inc.",
    status: "In Progress",
    startDate: "2025-01-15",
    endDate: "2025-03-31",
    manager: "Yema al Olman",
    teamSize: 5,
    progress: 65,
    kpis: [
      { label: "Open Findings", slug: "open-findings", count: 5, type: "warning", color: "hsl(var(--chart-3))" },
      { label: "Overdue Actions", slug: "overdue-actions", count: 2, type: "critical", color: "hsl(var(--chart-2))" },
    ],
    recentActivity: [
      { timestamp: "2025-06-22T10:30:00Z", message: "Risk assessment updated by Khaled M." },
      { timestamp: "2025-06-21T15:00:00Z", message: "Control testing phase initiated." },
    ],
    teamMembers: ["Yema al Olman", "Khaled M.", "Aisha B.", "Omar S.", "Fatima K."],
    taskStats: { pending: 10, inProgress: 15, completed: 20, onHold: 3 },
  },
  {
    id: "ENG-002",
    title: "Q3 Financial Systems Review",
    client: "SecureBank Corp.",
    status: "Planning",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    manager: "Mohammed Al Futtaim",
    teamSize: 3,
    progress: 15,
    kpis: [{ label: "Open Findings", slug: "open-findings", count: 0, type: "success", color: "hsl(var(--chart-4))" }],
    recentActivity: [{ timestamp: "2025-06-20T11:00:00Z", message: "Initial planning meeting scheduled." }],
    teamMembers: ["Mohammed Al Futtaim", "Layla R.", "Hassan J."],
    taskStats: { pending: 25, inProgress: 5, completed: 2 },
  },
  {
    id: "ENG-003",
    title: "2024 Compliance Check",
    client: "Healthcare Solutions Ltd.",
    status: "Completed",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    manager: "Yema al Olman",
    teamSize: 4,
    progress: 100,
    kpis: [{ label: "Open Findings", slug: "open-findings", count: 0, type: "success", color: "hsl(var(--chart-4))" }],
    recentActivity: [{ timestamp: "2024-04-28T16:00:00Z", message: "Final report submitted and approved." }],
    teamMembers: ["Yema al Olman", "Sara N.", "Ali T.", "Reem G."],
    taskStats: { pending: 0, inProgress: 0, completed: 30 },
  },
]
// --- End of shared data/type section ---

const chartConfigBase = {
  count: { label: "Count" },
  openFindings: { label: "Open Findings", color: "hsl(var(--chart-3))" }, // Matched to kpi.label for consistency
  overdueActions: { label: "Overdue Actions", color: "hsl(var(--chart-2))" },
  pending: { label: "Pending", color: "hsl(var(--chart-1))" },
  inProgress: { label: "In Progress", color: "hsl(var(--chart-3))" },
  completed: { label: "Completed", color: "hsl(var(--chart-4))" },
  onHold: { label: "On Hold", color: "hsl(var(--chart-5))" },
}

export default function EngagementDashboardPage() {
  const params = useParams()
  const router = useRouter() // Initialize router
  const engagementId = params.engagementId as string

  const [engagement, setEngagement] = useState<Engagement | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (engagementId) {
      setIsLoading(true)
      setTimeout(() => {
        const foundEngagement = mockEngagements.find((e) => e.id === engagementId)
        setEngagement(foundEngagement || null)
        setIsLoading(false)
      }, 500)
    }
  }, [engagementId])

  const handleKpiBarClick = (data: any) => {
    // data.payload contains the original data item for the bar
    if (data && data.payload && data.payload.slug) {
      const kpiSlug = data.payload.slug
      console.log(`KPI bar clicked: ${kpiSlug}, navigating...`)
      router.push(`/engagements/${engagementId}/kpi/${kpiSlug}`)
    }
  }

  const handleTaskStatusSliceClick = (data: any) => {
    // data contains the original data item for the slice
    if (data && data.name) {
      const statusSlug = data.name.toLowerCase().replace(/\s+/g, "-") // e.g., "In Progress" -> "in-progress"
      console.log(`Task status slice clicked: ${statusSlug}, navigating...`)
      router.push(`/engagements/${engagementId}/tasks?status=${statusSlug}`)
    }
  }

  if (isLoading || engagement === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Loading engagement dashboard...</p>
      </div>
    )
  }

  if (!engagement) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Engagement Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find an engagement with ID: <strong>{engagementId}</strong>.
        </p>
        <Button asChild>
          <Link href="/engagements">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Engagements
          </Link>
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: Engagement["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Planning":
        return "bg-yellow-500"
      case "In Review":
        return "bg-purple-500"
      case "On Hold":
        return "bg-gray-500"
      default:
        return "bg-gray-300"
    }
  }

  const kpiChartData =
    engagement.kpis
      ?.filter((kpi) => kpi.count > 0)
      .map((kpi) => ({ name: kpi.label, count: kpi.count, fill: kpi.color, slug: kpi.slug })) || []

  const taskStatusChartData = engagement.taskStats
    ? [
        { name: "Pending", value: engagement.taskStats.pending, fill: chartConfigBase.pending.color },
        { name: "In Progress", value: engagement.taskStats.inProgress, fill: chartConfigBase.inProgress.color },
        { name: "Completed", value: engagement.taskStats.completed, fill: chartConfigBase.completed.color },
        ...(engagement.taskStats.onHold
          ? [{ name: "On Hold", value: engagement.taskStats.onHold, fill: chartConfigBase.onHold.color }]
          : []),
      ].filter((item) => item.value > 0)
    : []

  const chartConfig = {
    ...chartConfigBase,
    ...Object.fromEntries(kpiChartData.map((kpi) => [kpi.slug, { label: kpi.name, color: kpi.fill }])),
  }

  // For Pie chart label formatter, ensure it uses the correct name from taskStatusChartData
  const pieLabelFormatter = (value: string, entry: any) => {
    // entry.name should be "Pending", "In Progress", etc.
    const configEntry =
      chartConfig[entry.name.toLowerCase().replace(/\s+/g, "-") as keyof typeof chartConfig] ||
      chartConfig[entry.name as keyof typeof chartConfig] // Fallback for direct match
    return configEntry?.label || entry.name
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/engagements">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Engagements</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{engagement.title}</h1>
            <p className="text-muted-foreground">
              Client: {engagement.client} (ID: {engagement.id})
            </p>
          </div>
        </div>
        <Badge className={`text-white ${getStatusColor(engagement.status)}`}>{engagement.status}</Badge>
      </div>

      {engagement.progress !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={engagement.progress} className="w-full h-3" />
              <span className="text-lg font-semibold">{engagement.progress}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Expected Completion: {new Date(engagement.endDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" /> KPI Overview
            </CardTitle>
            <CardDescription>Key Performance Indicators (Click bars for details)</CardDescription>
          </CardHeader>
          <CardContent>
            {kpiChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart
                  accessibilityLayer
                  data={kpiChartData}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                  onClick={handleKpiBarClick}
                  className="cursor-pointer"
                >
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={4}>
                    {kpiChartData.map((kpi) => (
                      <Cell key={kpi.name} fill={kpi.fill} />
                    ))}
                    <LabelList dataKey="count" position="right" offset={8} className="fill-foreground" fontSize={12} />
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No active KPIs to display.</p>
            )}
          </CardContent>
        </Card>

        {engagement.taskStats && taskStatusChartData.length > 0 && (
          <Card className="lg:col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" /> Task Status Breakdown
              </CardTitle>
              <CardDescription>Distribution of task statuses (Click slices for details)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <PieChart accessibilityLayer>
                  <ChartTooltip content={<ChartTooltipContent nameKey="value" />} />
                  <Pie
                    data={taskStatusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={40}
                    onClick={handleTaskStatusSliceClick} // Added onClick handler
                    className="cursor-pointer"
                  >
                    {taskStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}-${entry.name}`} fill={entry.fill} />
                    ))}
                    {/* LabelList for Pie can be tricky with small slices, consider if needed */}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Other cards remain the same */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" /> Key Dates & Info
            </CardTitle>
            <CardDescription>Manager: {engagement.manager}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Start Date:</span>
              <span className="font-medium">{new Date(engagement.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>End Date:</span>
              <span className="font-medium">{new Date(engagement.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span>Team Size:</span>
              <span className="font-medium">{engagement.teamSize}</span>
            </div>
            {engagement.kpis &&
              engagement.kpis.map((kpi) => (
                <div key={kpi.label} className="flex justify-between items-center">
                  <span>{kpi.label}:</span>
                  <Badge
                    variant={kpi.type === "critical" ? "destructive" : kpi.type === "warning" ? "secondary" : "default"}
                  >
                    {kpi.count}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className={!engagement.taskStats || taskStatusChartData.length === 0 ? "lg:col-span-2" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Assigned Team
            </CardTitle>
            <CardDescription>Personnel involved in this engagement</CardDescription>
          </CardHeader>
          <CardContent>
            {engagement.teamMembers && engagement.teamMembers.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {engagement.teamMembers.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No team members listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates for {engagement.title}</CardDescription>
          </CardHeader>
          <CardContent>
            {engagement.recentActivity && engagement.recentActivity.length > 0 ? (
              <ul className="space-y-3 text-sm">
                {engagement.recentActivity.slice(0, 5).map((activity, index) => (
                  <li key={index} className="border-b pb-1 mb-1 last:border-b-0 last:pb-0 last:mb-0">
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
      {engagement.description && (
        <Card>
          <CardHeader>
            <CardTitle>Engagement Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{engagement.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
