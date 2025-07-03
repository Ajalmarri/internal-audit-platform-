"use client"

import { Label } from "@/components/ui/label"

import { useState, useMemo } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, CalendarClock, Hourglass } from "lucide-react"
import {
  addDays,
  addWeeks,
  differenceInDays,
  format,
  getISOWeek,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns"

// --- Types ---
export interface AuditorProfile {
  id: string
  name: string
  department: string
  weeklyCapacityHours: number
  avatar?: string
}

export interface AuditorTask {
  id: string
  title: string
  auditorId: string
  startDate: Date
  endDate: Date
  estimatedHours: number
  auditPlanId?: string // Optional link to an audit plan
}

// --- Mock Data ---
const mockAuditors: AuditorProfile[] = [
  {
    id: "auditor1",
    name: "Khaled M.",
    department: "Financial Audit",
    weeklyCapacityHours: 40,
    avatar: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "auditor2",
    name: "Yema al Olman",
    department: "IT Audit",
    weeklyCapacityHours: 35,
    avatar: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "auditor3",
    name: "Fatima H.",
    department: "Operational Audit",
    weeklyCapacityHours: 40,
    avatar: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "auditor4",
    name: "Aisha B.",
    department: "Financial Audit",
    weeklyCapacityHours: 40,
    avatar: "/placeholder.svg?width=40&height=40",
  },
  {
    id: "auditor5",
    name: "Omar S.",
    department: "IT Audit",
    weeklyCapacityHours: 30, // Part-time or specialized
    avatar: "/placeholder.svg?width=40&height=40",
  },
]

const today = new Date("2025-06-16") // Set a fixed "today" for consistent mock data

const mockTasks: AuditorTask[] = [
  // Khaled M.
  {
    id: "task1",
    title: "FY25 Q2 Financial Review - Planning",
    auditorId: "auditor1",
    startDate: addDays(today, -7), // Started last week
    endDate: addDays(today, 7), // Ends next week
    estimatedHours: 30,
    auditPlanId: "AP006",
  },
  {
    id: "task2",
    title: "Client X Follow-up",
    auditorId: "auditor1",
    startDate: addDays(today, 8),
    endDate: addDays(today, 12),
    estimatedHours: 15,
  },
  // Yema al Olman
  {
    id: "task3",
    title: "ITGC Assessment - Phase 1",
    auditorId: "auditor2",
    startDate: today,
    endDate: addDays(today, 20), // Spans multiple weeks
    estimatedHours: 50, // Overload for some weeks
    auditPlanId: "AP007",
  },
  {
    id: "task4",
    title: "Security Policy Update Review",
    auditorId: "auditor2",
    startDate: addDays(today, 21),
    endDate: addDays(today, 30),
    estimatedHours: 25,
  },
  // Fatima H.
  {
    id: "task5",
    title: "Manufacturing Process Audit - Site Visit Prep",
    auditorId: "auditor3",
    startDate: addDays(today, 1),
    endDate: addDays(today, 5),
    estimatedHours: 40, // Full week
  },
  {
    id: "task6",
    title: "Operational Audit Report Draft",
    auditorId: "auditor3",
    startDate: addDays(today, 20),
    endDate: addDays(today, 40),
    estimatedHours: 60, // Spread out
  },
  // Aisha B.
  {
    id: "task7",
    title: "Bank Reconciliation Audit",
    auditorId: "auditor4",
    startDate: addDays(today, -3),
    endDate: addDays(today, 10),
    estimatedHours: 35,
  },
  // Omar S. (Potentially under-utilized or specialized tasks)
  {
    id: "task8",
    title: "Cloud Security Config Check",
    auditorId: "auditor5",
    startDate: addDays(today, 7),
    endDate: addDays(today, 14),
    estimatedHours: 15,
  },
  {
    id: "task9",
    title: "Data Privacy Training Material Review",
    auditorId: "auditor5",
    startDate: addDays(today, 21),
    endDate: addDays(today, 28),
    estimatedHours: 10,
  },
]

const departments = ["All", ...new Set(mockAuditors.map((a) => a.department))]

// --- Helper Functions ---
const getWeeksInRange = (startDate: Date, endDate: Date): Date[] => {
  const weeks: Date[] = []
  let current = startOfWeek(startDate, { weekStartsOn: 1 }) // Monday
  while (current <= endDate) {
    weeks.push(new Date(current))
    current = addWeeks(current, 1)
  }
  return weeks
}

const getWorkloadForAuditorInWeek = (auditorId: string, weekStartDate: Date, tasks: AuditorTask[]): number => {
  const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 })
  let totalHours = 0

  tasks
    .filter((task) => task.auditorId === auditorId)
    .forEach((task) => {
      const taskInterval = { start: task.startDate, end: task.endDate }
      const weekInterval = { start: weekStartDate, end: weekEndDate }

      // Check if task overlaps with the week
      if (
        isWithinInterval(task.startDate, weekInterval) ||
        isWithinInterval(task.endDate, weekInterval) ||
        (task.startDate < weekStartDate && task.endDate > weekEndDate)
      ) {
        // Calculate days of task within this week
        const effectiveTaskStart = task.startDate > weekStartDate ? task.startDate : weekStartDate
        const effectiveTaskEnd = task.endDate < weekEndDate ? task.endDate : weekEndDate

        // Add 1 to differenceInDays because it's inclusive for duration
        const daysInWeek = differenceInDays(effectiveTaskEnd, effectiveTaskStart) + 1
        const totalTaskDays = differenceInDays(task.endDate, task.startDate) + 1

        if (totalTaskDays > 0 && daysInWeek > 0) {
          const hoursThisWeek = (task.estimatedHours / totalTaskDays) * daysInWeek
          totalHours += hoursThisWeek
        }
      }
    })
  return Math.round(totalHours)
}

const getWorkloadColor = (allocatedHours: number, capacityHours: number): string => {
  if (capacityHours === 0) return "bg-gray-200 text-gray-600" // No capacity
  const utilization = allocatedHours / capacityHours
  if (utilization > 1.1) return "bg-red-600 text-white" // Very Over
  if (utilization > 1.0) return "bg-red-400 text-red-800" // Over
  if (utilization >= 0.8) return "bg-yellow-300 text-yellow-800" // Optimal/High
  if (utilization >= 0.5) return "bg-green-300 text-green-800" // Good
  return "bg-green-100 text-green-700" // Under
}

// --- Main Page Component ---
export default function ResourceWorkloadPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startOfWeek(today, { weekStartsOn: 1 }),
    to: addWeeks(endOfWeek(today, { weekStartsOn: 1 }), 7), // Default to approx 8 weeks
  })
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All")

  const filteredAuditors = useMemo(() => {
    if (selectedDepartment === "All") return mockAuditors
    return mockAuditors.filter((auditor) => auditor.department === selectedDepartment)
  }, [selectedDepartment])

  const weeksToDisplay = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return []
    return getWeeksInRange(dateRange.from, dateRange.to)
  }, [dateRange])

  const workloadData = useMemo(() => {
    return filteredAuditors.map((auditor) => ({
      ...auditor,
      weeklyWorkload: weeksToDisplay.map((weekStart) => {
        const allocated = getWorkloadForAuditorInWeek(auditor.id, weekStart, mockTasks)
        return {
          weekStart,
          allocatedHours: allocated,
          capacityHours: auditor.weeklyCapacityHours,
        }
      }),
    }))
  }, [filteredAuditors, weeksToDisplay])

  const summaryStats = useMemo(() => {
    let totalCapacity = 0
    let totalAllocated = 0
    const overUtilizedStaffInAnyWeek = new Set<string>()

    workloadData.forEach((auditor) => {
      auditor.weeklyWorkload.forEach((week) => {
        totalCapacity += auditor.weeklyCapacityHours // This sums capacity for each week displayed for each auditor
        totalAllocated += week.allocatedHours
        if (week.allocatedHours > auditor.weeklyCapacityHours) {
          overUtilizedStaffInAnyWeek.add(auditor.id)
        }
      })
    })
    // Adjust total capacity to be for the number of unique weeks * sum of auditor capacities
    const uniqueWeeksCount = weeksToDisplay.length
    const sumOfAuditorsCapacity = filteredAuditors.reduce((sum, auditor) => sum + auditor.weeklyCapacityHours, 0)
    totalCapacity = uniqueWeeksCount * sumOfAuditorsCapacity

    return {
      totalTeamCapacity: totalCapacity,
      totalAllocatedHours: Math.round(totalAllocated),
      numOverUtilizedStaff: overUtilizedStaffInAnyWeek.size,
    }
  }, [workloadData, weeksToDisplay, filteredAuditors])

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Resource Workload & Availability</CardTitle>
            <CardDescription>Visualize team member allocation and manage capacity.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="date-from">Date Range (From)</Label>
              <DatePicker date={dateRange.from} setDate={(date) => setDateRange((prev) => ({ ...prev, from: date }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date-to">Date Range (To)</Label>
              <DatePicker date={dateRange.to} setDate={(date) => setDateRange((prev) => ({ ...prev, to: date }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department-filter">Team/Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="department-filter" className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Capacity</CardTitle>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalTeamCapacity} hrs</div>
              <p className="text-xs text-muted-foreground">For selected period & team</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Allocated Hours</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalAllocatedHours} hrs</div>
              <p className="text-xs text-muted-foreground">
                {((summaryStats.totalAllocatedHours / summaryStats.totalTeamCapacity) * 100 || 0).toFixed(1)}% utilized
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Over-Utilized Staff</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.numOverUtilizedStaff}</div>
              <p className="text-xs text-muted-foreground">Staff over capacity in any week</p>
            </CardContent>
          </Card>
        </div>

        {/* Workload Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Workload Matrix</CardTitle>
            <CardDescription>Weekly allocated hours vs. capacity for each auditor.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background z-10 w-[200px] min-w-[200px]">Auditor</TableHead>
                    {weeksToDisplay.map((weekStart) => (
                      <TableHead key={weekStart.toISOString()} className="text-center min-w-[120px]">
                        W{getISOWeek(weekStart)} <br />
                        <span className="text-xs font-normal text-muted-foreground">{format(weekStart, "MMM d")}</span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workloadData.map((auditor) => (
                    <TableRow key={auditor.id}>
                      <TableCell className="sticky left-0 bg-background z-10 font-medium w-[200px] min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <img
                            src={auditor.avatar || "/placeholder.svg?width=32&height=32"}
                            alt={auditor.name}
                            className="h-8 w-8 rounded-full"
                          />
                          {auditor.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{auditor.department}</div>
                      </TableCell>
                      {auditor.weeklyWorkload.map((weekLoad, index) => (
                        <Tooltip key={index} delayDuration={100}>
                          <TooltipTrigger asChild>
                            <TableCell
                              className={`text-center p-0 ${getWorkloadColor(weekLoad.allocatedHours, weekLoad.capacityHours)}`}
                            >
                              <div className="p-2 h-full flex flex-col justify-center items-center">
                                <span className="font-semibold text-sm">{weekLoad.allocatedHours}h</span>
                                <span className="text-xs opacity-80">/ {weekLoad.capacityHours}h</span>
                              </div>
                            </TableCell>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {auditor.name} - Week {getISOWeek(weekLoad.weekStart)}
                            </p>
                            <p>Allocated: {weekLoad.allocatedHours}h</p>
                            <p>Capacity: {weekLoad.capacityHours}h</p>
                            <p>
                              Utilization:{" "}
                              {weekLoad.capacityHours > 0
                                ? ((weekLoad.allocatedHours / weekLoad.capacityHours) * 100).toFixed(0)
                                : 0}
                              %
                            </p>
                            <hr className="my-1" />
                            <p className="text-xs text-muted-foreground">Tasks this week:</p>
                            <ul className="list-disc list-inside text-xs">
                              {mockTasks
                                .filter(
                                  (t) =>
                                    t.auditorId === auditor.id &&
                                    (isWithinInterval(t.startDate, {
                                      start: weekLoad.weekStart,
                                      end: endOfWeek(weekLoad.weekStart, { weekStartsOn: 1 }),
                                    }) ||
                                      isWithinInterval(t.endDate, {
                                        start: weekLoad.weekStart,
                                        end: endOfWeek(weekLoad.weekStart, { weekStartsOn: 1 }),
                                      }) ||
                                      (t.startDate < weekLoad.weekStart &&
                                        t.endDate > endOfWeek(weekLoad.weekStart, { weekStartsOn: 1 }))),
                                )
                                .map((task) => (
                                  <li key={task.id}>{task.title}</li>
                                ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TableRow>
                  ))}
                  {workloadData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={weeksToDisplay.length + 1} className="h-24 text-center">
                        No auditors match the current filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
