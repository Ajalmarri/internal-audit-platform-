"use client"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Clock, AlertTriangle, FileText, Download, CheckCircle2 } from "lucide-react"

// Mock Data (Replace with your actual data fetching)
const mockActionPlans = [
  {
    id: 1,
    title: "Improve Customer Onboarding",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-03-15",
    responsiblePerson: "John Doe",
    progress: 60,
  },
  {
    id: 2,
    title: "Update Marketing Materials",
    status: "Completed",
    priority: "Medium",
    dueDate: "2024-02-28",
    responsiblePerson: "Jane Smith",
    progress: 100,
  },
  {
    id: 3,
    title: "Enhance Product Features",
    status: "Overdue",
    priority: "High",
    dueDate: "2024-01-31",
    responsiblePerson: "Peter Jones",
    progress: 30,
    overdueDays: 30,
  },
  {
    id: 4,
    title: "Streamline Internal Processes",
    status: "In Progress",
    priority: "Low",
    dueDate: "2024-03-22",
    responsiblePerson: "Alice Brown",
    progress: 80,
  },
  {
    id: 5,
    title: "Conduct Market Research",
    status: "Not Started",
    priority: "Medium",
    dueDate: "2024-04-15",
    responsiblePerson: "Bob Williams",
    progress: 0,
  },
  {
    id: 6,
    title: "Improve Customer Onboarding",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-03-15",
    responsiblePerson: "John Doe",
    progress: 60,
  },
  {
    id: 7,
    title: "Update Marketing Materials",
    status: "Completed",
    priority: "Medium",
    dueDate: "2024-02-28",
    responsiblePerson: "Jane Smith",
    progress: 100,
  },
  {
    id: 8,
    title: "Enhance Product Features",
    status: "Overdue",
    priority: "High",
    dueDate: "2024-01-31",
    responsiblePerson: "Peter Jones",
    progress: 30,
    overdueDays: 30,
  },
  {
    id: 9,
    title: "Streamline Internal Processes",
    status: "In Progress",
    priority: "Low",
    dueDate: "2024-03-22",
    responsiblePerson: "Alice Brown",
    progress: 80,
  },
  {
    id: 10,
    title: "Conduct Market Research",
    status: "Not Started",
    priority: "Medium",
    dueDate: "2024-04-15",
    responsiblePerson: "Bob Williams",
    progress: 0,
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const DashboardPage = () => {
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")

  const filteredActionPlans = useMemo(() => {
    let filtered = mockActionPlans

    if (filterStatus !== "All") {
      filtered = filtered.filter((plan) => plan.status === filterStatus)
    }

    if (filterPriority !== "All") {
      filtered = filtered.filter((plan) => plan.priority === filterPriority)
    }

    return filtered
  }, [mockActionPlans, filterStatus, filterPriority])

  const completedItems = useMemo(
    () => filteredActionPlans.filter((item) => item.status === "Completed"),
    [filteredActionPlans],
  )
  const overdueItems = useMemo(
    () => filteredActionPlans.filter((item) => item.status === "Overdue"),
    [filteredActionPlans],
  )
  const completionRate = useMemo(() => {
    if (filteredActionPlans.length === 0) return 0
    return Math.round((completedItems.length / filteredActionPlans.length) * 100)
  }, [completedItems, filteredActionPlans])

  const avgCompletionTime = useMemo(() => {
    // This is placeholder logic.  In a real app, you'd calculate this based on actual completion dates.
    return 15
  }, [])

  const priorityData = useMemo(() => {
    const high = filteredActionPlans.filter((item) => item.priority === "High").length
    const medium = filteredActionPlans.filter((item) => item.priority === "Medium").length
    const low = filteredActionPlans.filter((item) => item.priority === "Low").length
    return [
      { name: "High", value: high },
      { name: "Medium", value: medium },
      { name: "Low", value: low },
    ]
  }, [filteredActionPlans])

  const statusData = useMemo(() => {
    const inProgress = filteredActionPlans.filter((item) => item.status === "In Progress").length
    const completed = filteredActionPlans.filter((item) => item.status === "Completed").length
    const overdue = filteredActionPlans.filter((item) => item.status === "Overdue").length
    const notStarted = filteredActionPlans.filter((item) => item.status === "Not Started").length
    return [
      { name: "In Progress", value: inProgress },
      { name: "Completed", value: completed },
      { name: "Overdue", value: overdue },
      { name: "Not Started", value: notStarted },
    ]
  }, [filteredActionPlans])

  const handleExportPDF = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default
      await import("jspdf-autotable")

      const doc = new jsPDF()

      // Add title
      doc.setFontSize(20)
      doc.text("Action Plans Dashboard Report", 20, 20)

      // Add generation date
      doc.setFontSize(12)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35)

      // Add summary metrics
      doc.setFontSize(14)
      doc.text("Summary Metrics", 20, 55)

      const summaryData = [
        ["Total Action Plans", mockActionPlans.length.toString()],
        ["Overdue Plans", overdueItems.length.toString()],
        ["Completion Rate", `${completionRate}%`],
        ["Average Completion Time", `${avgCompletionTime} days`],
      ]

      // Use the autoTable method (now properly imported)
      ;(doc as any).autoTable({
        startY: 65,
        head: [["Metric", "Value"]],
        body: summaryData,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
      })

      // Add overdue items table
      if (overdueItems.length > 0) {
        doc.setFontSize(14)
        doc.text("Overdue Items", 20, (doc as any).lastAutoTable.finalY + 20)

        const overdueData = overdueItems.map((item) => [
          item.title,
          item.responsiblePerson,
          item.priority,
          `${item.overdueDays} days`,
        ])
        ;(doc as any).autoTable({
          startY: (doc as any).lastAutoTable.finalY + 30,
          head: [["Action Plan", "Responsible Person", "Priority", "Overdue By"]],
          body: overdueData,
          theme: "grid",
          headStyles: { fillColor: [239, 68, 68] },
        })
      }

      // Save the PDF
      doc.save("action-plans-dashboard.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      // Fallback: create a simple text-based report
      const reportContent = `
Action Plans Dashboard Report
Generated on: ${new Date().toLocaleDateString()}

Summary Metrics:
- Total Action Plans: ${mockActionPlans.length}
- Overdue Plans: ${overdueItems.length}
- Completion Rate: ${completionRate}%
- Average Completion Time: ${avgCompletionTime} days

${
  overdueItems.length > 0
    ? `
Overdue Items:
${overdueItems.map((item) => `- ${item.title} (${item.responsiblePerson}) - ${item.overdueDays} days overdue`).join("\n")}
`
    : "No overdue items."
}
      `.trim()

      // Create and download as text file
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "action-plans-dashboard.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Action Plans Dashboard</h1>
        <Button onClick={handleExportPDF}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Action Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActionPlans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Overdue Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg. Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionTime} days</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Action Plans</h2>
        <div className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Priority Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsible Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActionPlans.map((plan) => (
              <tr key={plan.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{plan.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    className={
                      plan.status === "Completed"
                        ? "bg-green-500 text-white"
                        : plan.status === "Overdue"
                          ? "bg-red-500 text-white"
                          : plan.status === "In Progress"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-400 text-white"
                    }
                  >
                    {plan.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{plan.priority}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{plan.dueDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{plan.responsiblePerson}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Progress value={plan.progress} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage
